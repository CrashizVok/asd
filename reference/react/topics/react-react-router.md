# React Router

React topic · Exam Wiki

## Simplest form

```jsx
// Data shape: a URL path maps to one element
// { '/': <Home />, '/hotels': <Hotels /> }
// Install once: npm install react-router-dom
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/hotels" element={<Hotels />} />
            </Routes>
        </BrowserRouter>
    );
}

// main.jsx stays untouched: createRoot(...).render(<App />)
```

Three components and the browser URL. Nothing else is needed for a working multi page app.

## What it does

A single page app has one HTML document. Without a router the browser would ask the server for `/hotels` and get the same `index.html` back, or a 404 from a server that has no such file. React Router takes over the part of the browser that reads the address bar and changes it, so the URL becomes application state.

The router listens to the `history` API of the browser. When the URL changes, whether from a click on a link, a form submit, or the back button, the router runs the route table again and renders the element that matches. No request leaves the page. This is why the URL still looks real: a student can copy `/hotels/7` into a new tab, and the server must be configured to serve `index.html` for every path (a fallback rule, usually called a rewrite).

The router keeps three pieces of information in sync: the path, the query string, and an optional state object that is stored in the history entry itself. `useParams` reads the dynamic part of the path, `useSearchParams` reads the query string, `useLocation` reads both plus the state. Everything the router hands back comes from the URL, so a page that reads only from these hooks survives a refresh.

## Every part

### BrowserRouter

`BrowserRouter` is the provider. It creates the history object, subscribes to `popstate`, and puts the current location into React context. Every hook in this page throws if no router sits above it, so mount one router, usually in `main.jsx` or at the top of `App`, and never nest a second one.

Choose `HashRouter` only when the server cannot be configured for rewrites, because then the path lives after `#` and the server never sees it. `MemoryRouter` is for tests: it keeps the whole history in memory.

### Routes and Route matching

`Routes` is the switch. It looks at its children in order of specificity, not in source order, picks the single best match, and renders only that one. So a `*` route can sit first in the JSX and still lose to `/hotels/:hotel_id`.

`Route` takes `path` and `element`. The path may be absolute (`/hotels`) or relative to the parent route (`:hotel_id`). A relative path must not start with a slash inside a nested route, or it escapes the parent.

A path segment starting with `:` is a parameter and matches one segment:

```jsx
<Route path="/hotels/:hotel_id" element={<HotelDetail />} />
```

A trailing `*` is a splat and matches everything that follows, including slashes. `path="*"` alone matches any URL at that level, which is how a not-found page is built.

React Router 6.4 added a second spelling where the component is passed directly and receives the route props: `<Route path="/hotels" Component={Hotels} />`. It exists because the data router API can then keep the component mounted across param changes. For an exam, `element` is the safe answer.

### Index route

An index route is the child that renders when the parent path matches exactly and nothing else is specified.

```jsx
<Route path="/hotels" element={<HotelsLayout />}>
    <Route index element={<HotelList />} />
    <Route path=":hotel_id" element={<HotelDetail />} />
</Route>
```

`/hotels` renders `HotelsLayout` with `HotelList` inside the outlet. `/hotels/7` renders the same layout with `HotelDetail`. Writing `<Route path="" ...>` instead of `index` is the usual mistake; an empty path does not match the parent URL in a nested position.

### Nested routes and Outlet

A parent route renders its own element, and inside that element a single `<Outlet />` decides where the child goes. The parent does not know the child. That is the point: shared header, sidebar, breadcrumb or tab bar stay mounted while only the outlet content swaps.

```jsx
function HotelsLayout() {
    return (
        <section>
            <h2>Hotels</h2>
            <Outlet />          {/* child route renders here */}
        </section>
    );
}
```

If the parent renders no `<Outlet />`, the child route still matches, the URL changes, and nothing appears. Check the outlet before you check the route paths.

### Link and NavLink

`Link` renders an `<a>` with a real `href` and intercepts the click, so ctrl click and middle click still open a new tab. Use it for every internal navigation. A plain `<a href="/hotels">` reloads the document and throws away all React state.

```jsx
<Link to="/hotels/7">Hotel</Link>
<Link to="/hotels/7" replace>Hotel</Link>        {/* no new history entry */}
```

`NavLink` is `Link` plus an `isActive` flag for the current URL. The default is a prefix match, so `/hotels` stays active on `/hotels/7`. Add `end` to stop that.

```jsx
<NavLink
    to="/hotels"
    end
    className={({ isActive }) => (isActive ? 'nav on' : 'nav')}
>
    Hotels
</NavLink>
```

The `className` prop accepts a function, which is how you avoid hand rolling a comparison against `useLocation().pathname`. `style` accepts the same kind of function.

### useParams

`useParams` returns an object of the dynamic segments of the matched route. Every value is a string, even a numeric id, and the object is empty when the route has no parameters.

```jsx
const { hotel_id } = useParams();     // '/hotels/7' -> { hotel_id: '7' }
const id = Number(hotel_id);          // parse before comparing or fetching
```

A changed parameter re-renders the component; it does not remount it in the data router API, so an effect that fetches must list the parameter in its dependency array. With `<Route element={...}>` and `useParams`, the component remounts on a path change by default. Both behaviours are worth knowing because an exam question about a stale page usually turns on this.

### useNavigate

`useNavigate` returns a function for navigation that a click cannot express: after a successful POST, after a failed auth check, after a timeout.

```jsx
const navigate = useNavigate();

navigate('/hotels');                       // push
navigate(-1);                              // back, like the browser button
navigate('/login', { replace: true });     // replace the current entry
navigate('/hotels/7', { state: { from: 'search' } });
```

`{ replace: true }` matters after login and after a delete. With a push, the back button returns to the page the user just left and a refresh there repeats the action.

The `state` value is stored in the history entry, not in the URL. It survives a refresh of that entry but not a copied link, which makes it right for "return to where you came from" and wrong for anything that must be shareable.

Read it with `useLocation().state`.

### useSearchParams

`useSearchParams` is the query string as state, built on the platform `URLSearchParams`.

```jsx
// Data shape: ?city=Eger&stars=4 -> URLSearchParams of string pairs
const [searchParams, setSearchParams] = useSearchParams();

const city = searchParams.get('city') ?? '';      // 'Eger', null when absent
const stars = Number(searchParams.get('stars') ?? 0);
```

`setSearchParams` writes and navigates in one step. Passing an object replaces the whole query string, it does not merge:

```jsx
setSearchParams({ city: 'Eger' });                // ?city=Eger, stars is gone
setSearchParams({ city, stars });                  // keep what you mean to keep
```

To merge, copy first:

```jsx
const next = new URLSearchParams(searchParams);
if (city) next.set('city', city); else next.delete('city');
setSearchParams(next);
```

The setter also takes a function of the previous params and an options object with `replace`, which is the right choice for a search box that fires on every keystroke, otherwise each letter becomes a history entry.

### Search encoding

Values are percent encoded when written and decoded when read, so you never call `encodeURIComponent` yourself. A city with an accent, a space, an `&` or a `#` survives the round trip:

```jsx
// city = 'Békéscsaba & környéke'
setSearchParams({ city });        // URL: ?city=B%C3%A9k%C3%A9scsaba+%26+k%C3%B6rny%C3%A9ke
searchParams.get('city');         // 'Békéscsaba & környéke'
```

`URLSearchParams` encodes a space as `+` in the query string and decodes both `+` and `%20` back to a space. That is form encoding, and it is correct here.

Two limits. `get` returns the first value of a repeated key, use `getAll` for checkboxes that produce `?tag=a&tag=b`. And an empty query string is not the same as a missing key: `get('city')` is `null` when absent and `''` for `?city=`. Decide which one means "no filter" and write it once.

Reading the URL as the source of truth also makes the page shareable: send `/hotels?city=Eger&stars=4` to another student and they see the same filtered list. Local `useState` cannot do that.

### Layout route

A layout route is a route with no path logic of its own, only an element and an outlet. It carries the chrome: header, navigation, footer, a sidebar that stays open.

```jsx
<Routes>
    <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="*" element={<NotFound />} />
    </Route>
</Routes>
```

A `Route` without `path` matches at the level of its children, so this pattern avoids repeating the layout in every route. The catch is that the 404 needs to be inside the layout to keep the header, and outside any section that should not swallow it.

### Protected routes

Authentication is a wrapper component, not a route feature. It reads the auth state and either renders the child or redirects.

```jsx
function RequireAuth({ children }) {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return children;
}
```

`<Navigate>` renders a redirect during render. It replaces the entry, so the back button does not bounce between login and the protected page forever. The `state` carries the original location, and the login page sends the user back there:

```jsx
const location = useLocation();
const navigate = useNavigate();
const from = location.state?.from?.pathname ?? '/';

// after a successful login
navigate(from, { replace: true });
```

Protection on the client is convenience, never security. The API must reject the request too, because a determined student can call the endpoint directly.

### 404 inside a big app

One `path="*"` at the root catches unknown URLs. A second one inside a section catches a bad child path while keeping that section's layout:

```jsx
<Route path="/hotels" element={<HotelsLayout />}>
    <Route index element={<HotelList />} />
    <Route path=":hotel_id" element={<HotelDetail />} />
    <Route path="*" element={<SectionNotFound />} />
</Route>
```

Order in the JSX does not matter, specificity does. `:hotel_id` wins over `*` because a dynamic segment is more specific than a splat. If `SectionNotFound` never shows up, a parent `*` is probably shadowing it.

## Examples

### Example 1: three pages, one nav bar, no parameters

The smallest complete app. `main.jsx` mounts it, `App.jsx` holds the table.

```jsx
// main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);
```

```jsx
// App.jsx
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';

function Home() {
    return <h1>Exam wiki</h1>;
}

function Hotels() {
    return <h1>Hotels</h1>;
}

function About() {
    return <h1>About</h1>;
}

export default function App() {
    return (
        <BrowserRouter>
            <nav>
                {/* end on '/' or every path looks active */}
                <NavLink to="/" end>Home</NavLink>
                <NavLink to="/hotels">Hotels</NavLink>
                <NavLink to="/about">About</NavLink>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/hotels" element={<Hotels />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </BrowserRouter>
    );
}
```

The nav sits outside `Routes`, so it stays mounted while pages swap. Clicking `Hotels` changes the URL and re-renders only the route element.

### Example 2: nested routes, a layout with Outlet, and params

Two levels, one shared section header, a detail page that reads its id from the URL, and a section level 404.

```jsx
// App.jsx
import { BrowserRouter, Routes, Route, Link, Outlet, useParams } from 'react-router-dom';

const hotels = [
    { hotel_id: 1, name: 'Lake House', city: 'Eger', stars: 3 },
    { hotel_id: 2, name: 'Hilltop', city: 'Pécs', stars: 4 },
];

function HotelsLayout() {
    return (
        <section>
            <h2>Hotels</h2>
            <p>Pick one, the address bar keeps the id.</p>
            {/* children render here, the layout stays mounted */}
            <Outlet />
        </section>
    );
}

function HotelList() {
    return (
        <ul>
            {hotels.map((hotel) => (
                <li key={hotel.hotel_id}>
                    <Link to={`/hotels/${hotel.hotel_id}`}>{hotel.name}</Link>
                </li>
            ))}
        </ul>
    );
}

function HotelDetail() {
    // params are strings, parse before you compare
    const { hotel_id } = useParams();
    const hotel = hotels.find((item) => item.hotel_id === Number(hotel_id));

    if (!hotel) return <p>No hotel with id {hotel_id}.</p>;

    return (
        <article>
            <h3>{hotel.name}</h3>
            <p>{hotel.city}, {hotel.stars} stars</p>
        </article>
    );
}

function SectionNotFound() {
    return <p>That page does not exist inside hotels.</p>;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* parent path without a leading slash on children */}
                <Route path="/hotels" element={<HotelsLayout />}>
                    <Route index element={<HotelList />} />
                    <Route path=":hotel_id" element={<HotelDetail />} />
                    <Route path="*" element={<SectionNotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
```

`/hotels` renders the layout with the list. `/hotels/2` renders the layout with the detail. The layout element is not repeated on the child route, which is the whole reason `Outlet` exists.

### Example 3: search params as the filter state

A list filtered by the URL. Refresh keeps the filter, and the link can be shared.

```jsx
// HotelsSearch.jsx
import { useSearchParams } from 'react-router-dom';

const hotels = [
    { hotel_id: 1, name: 'Lake House', city: 'Eger', stars: 3 },
    { hotel_id: 2, name: 'Hilltop', city: 'Pécs', stars: 4 },
    { hotel_id: 3, name: 'Orchard', city: 'Eger', stars: 5 },
];

export default function HotelsSearch() {
    const [searchParams, setSearchParams] = useSearchParams();

    const city = searchParams.get('city') ?? '';
    const minStars = Number(searchParams.get('stars') ?? 0);

    const visible = hotels.filter(
        (hotel) =>
            (city === '' || hotel.city === city) && hotel.stars >= minStars
    );

    // copy, change one key, write back: a plain object would drop the other key
    function update(key, value) {
        const next = new URLSearchParams(searchParams);
        if (value) next.set(key, value);
        else next.delete(key);
        // replace keeps typing out of the history stack
        setSearchParams(next, { replace: true });
    }

    return (
        <div>
            <label>
                City
                <input
                    value={city}
                    onChange={(event) => update('city', event.target.value)}
                />
            </label>

            <label>
                Minimum stars
                <input
                    type="number"
                    min="0"
                    max="5"
                    value={minStars}
                    onChange={(event) => update('stars', event.target.value)}
                />
            </label>

            <p>{visible.length} hotel(s)</p>
            <ul>
                {visible.map((hotel) => (
                    <li key={hotel.hotel_id}>
                        {hotel.name}, {hotel.city}, {hotel.stars} stars
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

Type `Eger` and the address bar becomes `?city=Eger`. Type an accented city and the encoding is handled for you. Delete the text and the key is removed, so the URL goes back to plain `/hotels`.

### Example 4: protected route and a login that returns

Two routes, one wrapper, one redirect each way.

```jsx
// auth.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
```

```jsx
// App.jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth.jsx';

function RequireAuth({ children }) {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        // replace: the protected URL should not stay in the history stack
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return children;
}

function Admin() {
    return <h1>Admin panel</h1>;
}

function Login() {
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // send the user back where they came from, default to home
    const from = location.state?.from?.pathname ?? '/';

    function handleSubmit(event) {
        event.preventDefault();
        setUser({ email: 'student@example.test' });
        navigate(from, { replace: true });
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Sign in</h1>
            <button type="submit">Continue</button>
        </form>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<h1>Home</h1>} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/admin"
                        element={
                            <RequireAuth>
                                <Admin />
                            </RequireAuth>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
```

Open `/admin` while logged out: the router redirects to `/login` and remembers `from`. Submit the form: `navigate(from, { replace: true })` lands on `/admin` and replaces the login entry, so the back button goes home, not back into a redirect loop.

### Example 5: a complete booking app

One file per concept, all commented, read top to bottom. It has a layout route, an index route, a param route, a search route with encoded params, a protected admin section, two not-found pages, and a page that navigates after a POST.

```jsx
// main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);
```

```jsx
// App.jsx
import { BrowserRouter, Routes, Route, Navigate, Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth.jsx';
import Home from './pages/Home.jsx';
import HotelList from './pages/HotelList.jsx';
import HotelDetail from './pages/HotelDetail.jsx';
import HotelSearch from './pages/HotelSearch.jsx';
import BookingForm from './pages/BookingForm.jsx';
import Login from './pages/Login.jsx';
import Admin from './pages/Admin.jsx';
import NotFound from './pages/NotFound.jsx';

// The chrome. Mounted once, so links and header never re render on navigation.
function Layout() {
    return (
        <>
            <header>
                <strong>Hotel wiki</strong>
                <nav>
                    <NavLink to="/" end>Home</NavLink>
                    <NavLink to="/hotels">Hotels</NavLink>
                    <NavLink to="/search">Search</NavLink>
                    <NavLink to="/admin">Admin</NavLink>
                </nav>
            </header>

            <main>
                {/* every page below lands here */}
                <Outlet />
            </main>

            <footer>Exam build, no network</footer>
        </>
    );
}

// Section chrome for /hotels. Keeps the tab row while the detail page loads.
function HotelsLayout() {
    return (
        <>
            <h1>Hotels</h1>
            <p>
                <Link to="/hotels">All</Link> | <Link to="/search">Search</Link>
            </p>
            <Outlet />
        </>
    );
}

function RequireAuth({ children }) {
    const { user } = useAuth();
    const location = useLocation();

    // state carries the attempted URL so login can come back to it
    if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
    return children;
}

export default function App() {
    return (
        <AuthProvider>
            {/* one router for the whole app, never inside a component that re renders often */}
            <BrowserRouter>
                <Routes>
                    {/* pathless route: layout only, children carry the paths */}
                    <Route element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="login" element={<Login />} />

                        <Route path="hotels" element={<HotelsLayout />}>
                            <Route index element={<HotelList />} />
                            {/* :hotel_id is one segment, always a string */}
                            <Route path=":hotel_id" element={<HotelDetail />} />
                            <Route path=":hotel_id/book" element={<BookingForm />} />
                            {/* bad child path keeps the section header */}
                            <Route path="*" element={<NotFound scope="hotels" />} />
                        </Route>

                        <Route path="search" element={<HotelSearch />} />

                        <Route
                            path="admin"
                            element={
                                <RequireAuth>
                                    <Admin />
                                </RequireAuth>
                            }
                        />

                        {/* root catch all, must be last in intent, not in order */}
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
```

```jsx
// pages/HotelList.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function HotelList() {
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        // a relative URL on purpose: the app is served from any folder
        fetch('/api/hotels')
            .then((response) => response.json())
            .then(setHotels)
            .catch(() => setHotels([]));
    }, []);

    return (
        <ul>
            {hotels.map((hotel) => (
                <li key={hotel.hotel_id}>
                    {/* Link builds the path, the route table reads the id back */}
                    <Link to={`/hotels/${hotel.hotel_id}`}>{hotel.name}</Link>
                    {' '}
                    <Link to={`/hotels/${hotel.hotel_id}/book`}>Book</Link>
                </li>
            ))}
        </ul>
    );
}
```

```jsx
// pages/HotelDetail.jsx
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function HotelDetail() {
    const { hotel_id } = useParams();
    const [hotel, setHotel] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // hotel_id is in the dependency list, otherwise a link to another
        // hotel updates the URL and leaves the old data on screen
        let alive = true;
        fetch(`/api/hotels/${hotel_id}`)
            .then((response) => {
                if (!response.ok) throw new Error('not found');
                return response.json();
            })
            .then((data) => alive && setHotel(data))
            .catch(() => alive && setError('No such hotel.'));

        return () => {
            alive = false;       // ignore a late response after unmount
        };
    }, [hotel_id]);

    if (error) return <p>{error}</p>;
    if (!hotel) return <p>Loading...</p>;

    return (
        <article>
            <h2>{hotel.name}</h2>
            <p>{hotel.city}, {hotel.stars} stars</p>
            <p>{hotel.description}</p>
            <Link to={`/hotels/${hotel.hotel_id}/book`}>Book this hotel</Link>
        </article>
    );
}
```

```jsx
// pages/BookingForm.jsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function BookingForm() {
    const { hotel_id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        customer_email: '',
        first_name: '',
        last_name: '',
        start_date: '',
        end_date: '',
        adults: 1,
        children: 0,
    });
    const [sending, setSending] = useState(false);

    function change(event) {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    }

    async function submit(event) {
        event.preventDefault();
        setSending(true);

        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, hotel_id: Number(hotel_id) }),
        });

        setSending(false);

        if (response.ok) {
            // replace: the filled form must not come back with the back button
            navigate(`/hotels/${hotel_id}`, { replace: true });
        }
    }

    return (
        <form onSubmit={submit}>
            <h2>Booking for hotel {hotel_id}</h2>
            <input name="customer_email" value={form.customer_email} onChange={change} placeholder="email" />
            <input name="first_name" value={form.first_name} onChange={change} placeholder="first name" />
            <input name="last_name" value={form.last_name} onChange={change} placeholder="last name" />
            <input name="start_date" type="date" value={form.start_date} onChange={change} />
            <input name="end_date" type="date" value={form.end_date} onChange={change} />
            <input name="adults" type="number" min="1" value={form.adults} onChange={change} />
            <input name="children" type="number" min="0" value={form.children} onChange={change} />
            <button disabled={sending}>{sending ? 'Sending...' : 'Book'}</button>
        </form>
    );
}
```

```jsx
// pages/HotelSearch.jsx
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function HotelSearch() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [results, setResults] = useState([]);

    // the URL is the state, so a refresh repeats the same search
    const city = searchParams.get('city') ?? '';
    const stars = searchParams.get('stars') ?? '';

    useEffect(() => {
        if (!city) {
            setResults([]);
            return;
        }

        // URLSearchParams does the encoding, do not build the string by hand
        const query = new URLSearchParams({ city, stars });
        fetch(`/api/hotels?${query}`)
            .then((response) => response.json())
            .then(setResults)
            .catch(() => setResults([]));
    }, [city, stars]);

    function update(key, value) {
        const next = new URLSearchParams(searchParams);
        if (value) next.set(key, value);
        else next.delete(key);
        setSearchParams(next, { replace: true });
    }

    return (
        <>
            <h1>Search</h1>
            <input value={city} onChange={(event) => update('city', event.target.value)} placeholder="city" />
            <input value={stars} onChange={(event) => update('stars', event.target.value)} placeholder="stars" />

            <ul>
                {results.map((hotel) => (
                    <li key={hotel.hotel_id}>
                        <Link to={`/hotels/${hotel.hotel_id}`}>{hotel.name}</Link>
                    </li>
                ))}
            </ul>
        </>
    );
}
```

```jsx
// pages/Login.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function Login() {
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // where RequireAuth sent us from, home when opened directly
    const from = location.state?.from?.pathname ?? '/';

    function submit(event) {
        event.preventDefault();
        setUser({ email: 'student@example.test' });
        navigate(from, { replace: true });
    }

    return (
        <form onSubmit={submit}>
            <h1>Sign in</h1>
            <button type="submit">Continue</button>
        </form>
    );
}
```

```jsx
// pages/Admin.jsx
export default function Admin() {
    return (
        <>
            <h1>Admin</h1>
            <p>Only a signed in user reaches this element.</p>
        </>
    );
}
```

```jsx
// pages/NotFound.jsx
import { Link } from 'react-router-dom';

export default function NotFound({ scope }) {
    return (
        <div>
            <h1>404</h1>
            <p>
                {scope === 'hotels'
                    ? 'No such page inside hotels.'
                    : 'No such page.'}
            </p>
            <Link to="/">Back home</Link>
        </div>
    );
}
```

```jsx
// pages/Home.jsx
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <>
            <h1>Home</h1>
            <Link to="/hotels">Browse hotels</Link>
        </>
    );
}
```

Read the route table again after the pages. Every URL the app can produce has one line there, and every line renders exactly one element. `/hotels/3/book` matches `:hotel_id/book` because a static segment plus a param is more specific than `*`. `/hotels/3/anything` falls to the section 404 and keeps the layout. `/nope` falls to the root 404 and still has the header, because both 404 routes live inside the layout route.

The server needs one rewrite: any path that is not a file returns `index.html`. Without it `/hotels/3` is a hard 404 from the server even though the client route exists.

## Common mistakes

A router inside a component that re renders on every navigation. `BrowserRouter` creates a history object; a new one on each render resets the location. Mount it once, above `Routes`, and keep it out of components that take changing props.

`<Route path="/hotels" component={Hotels} />`. That is React Router 4 and 5. Version 6 wants `element={<Hotels />}` or `Component={Hotels}`. A lowercase `component` is ignored and the route renders nothing.

A relative child path written with a leading slash. `<Route path="/:hotel_id">` under `/hotels` escapes the parent and matches `/:hotel_id` at the root. Drop the slash.

No `<Outlet />` in the parent element. The URL changes, the parent renders, the child does not. This looks like a routing failure and is a one line fix.

`<a href="/hotels">` where `<Link to="/hotels">` belongs. The document reloads, the auth state and the search params in memory are lost.

`useParams` values compared to numbers without parsing. `hotel_id === 3` is false for `'3'`; the page shows "not found" for data that exists.

Reading objects from `useLocation().state` without a fallback. The state is gone on a direct visit, so `location.state.from.pathname` throws. Write `location.state?.from?.pathname ?? '/'`.

`setSearchParams({ city })` when another key must survive. The object form replaces the query string. Copy the existing params first.

A `*` route placed where it shadows a section. Specificity usually saves you, but a parent `*` and a child `*` both matching is confusing to debug. Keep one catch all per level and test a known bad URL.

`useNavigate` inside an effect without a dependency list, or called during render. Navigation is a side effect; call it from a handler or an effect, and guard the effect against running twice in development.

Trusting `useParams` in a fetch effect without listing it as a dependency. The URL changes, the effect does not rerun, and stale data stays on screen. Add the param and cancel the late response.

Assuming client route protection is security. `RequireAuth` hides UI. The API must check the session on every request.

A `path="*"` 404 without a link home. The user is stuck with the back button. Put a `Link` in the not-found page.

## Exam checklist

Can you explain why a browser refresh on `/hotels/3` needs a server rewrite, and what rule you would add?

Do you know which component must wrap the app so `useNavigate` does not throw?

Can you write the route table for a list page, a detail page with `:hotel_id`, a nested layout, and a 404, without looking?

Do you know the difference between `<Route index>` and `<Route path="">`, and why `index` is the correct one?

Can you explain what `Outlet` renders and what happens when the parent element omits it?

Do you reach for `Link` and `NavLink` instead of `a`, and can you write the `className` function that adds an active class, plus the `end` prop for the home link?

Can you read a param, convert it to a number, and use it in a fetch effect with the right dependency array?

Can you navigate after a POST with the correct `replace` option, and say what breaks without it?

Can you put a filter in the URL with `useSearchParams`, merge the new key into the existing string, and rely on automatic percent encoding for an accented value?

Can you write a `RequireAuth` component that redirects with `<Navigate replace state={{ from: location }} />`, and a login page that returns to that path?

Do you know why `location.state` disappears on a copied link, and what to use instead when the value must be shareable?

Can you tell the difference between a root 404 and a section 404, and predict which one a URL like `/hotels/3/nope` hits?

