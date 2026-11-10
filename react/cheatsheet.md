# React cheat sheet

The exam frontend is a small data-driven app: a list page, a detail page, a search page, and some layout. Write the API call first, then the loading and error states, then the markup.

## Create the project

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm install axios react-router-dom react-icons
npm run dev
```

Vite serves the app on `http://localhost:5173` and reloads on save.

## JSX rules

```jsx
function Card() {
    const name = 'Danube View';
    return (
        <article className="card">
            <h2>{name}</h2>
            <p>{2 + 3}</p>
        </article>
    );
}
```

- Return one parent element, or a fragment `<>...</>`.
- Close every tag, including `<img />` and `<input />`.
- Use `className`, not `class`.
- Use `{expression}` for JavaScript.
- JavaScript comments inside JSX need `{/* ... */}`.
- A component name starts with a capital letter.

## Components and props

```jsx
function Badge({ text, tone = 'blue' }) {
    return <span className={`badge badge-${tone}`}>{text}</span>;
}

function App() {
    return <Badge text="New" tone="green" />;
}
```

Props are read only. A default value belongs in the destructuring pattern. Pass functions as props when a child needs to notify a parent:

```jsx
function Button({ onClick, children }) {
    return <button onClick={onClick}>{children}</button>;
}
```

## State

```jsx
import { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);

    return (
        <button onClick={() => setCount(count + 1)}>
            Clicked {count} times
        </button>
    );
}
```

For the next value based on the previous one, use the updater form:

```jsx
setCount(current => current + 1);
```

Never mutate state directly. Replace objects and arrays:

```jsx
setUser({ ...user, name: 'Anna' });
setItems([...items, newItem]);
setItems(items.filter(item => item.id !== id));
```

## Events

```jsx
function Form() {
    function handleSubmit(event) {
        event.preventDefault();
        console.log('sent');
    }

    return (
        <form onSubmit={handleSubmit}>
            <button type="submit">Send</button>
        </form>
    );
}
```

`event.preventDefault()` stops the browser from reloading the page on a form submit. Use an arrow function when you need to pass an argument:

```jsx
<button onClick={() => remove(item.id)}>Delete</button>
```

Do not call the function while rendering: `onClick={remove(item.id)}` runs immediately. Wrap it.

## Lists and keys

```jsx
<ul>
    {hotels.map(hotel => (
        <li key={hotel.id}>{hotel.name}</li>
    ))}
</ul>
```

The key must be stable and unique among siblings. Use a database id. Use the array index only when the list never reorders and never changes length.

## Conditional rendering

```jsx
{loading && <p>Loading...</p>}
{error && <p className="error">{error}</p>}
{!loading && !error && items.length === 0 && <p>No data.</p>}

{user ? <Dashboard user={user} /> : <Login />}
```

`&&` returns the left side when it is falsy. A `0` would render as `0`, so use `items.length > 0 && ...` when the left side can be a number.

## Forms

```jsx
function Search() {
    const [word, setWord] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        const trimmed = word.trim();
        if (trimmed.length < 3) {
            return;
        }
        console.log(trimmed);
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={word}
                onChange={event => setWord(event.target.value)}
                placeholder="Search"
            />
            <button type="submit">Search</button>
        </form>
    );
}
```

A controlled input has `value` and `onChange`. An uncontrolled input uses `defaultValue` and a ref. The exam usually wants controlled.

## useEffect

```jsx
import { useEffect, useState } from 'react';

function Hotels() {
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        let active = true;

        fetch('/api/hotels')
            .then(response => response.json())
            .then(data => {
                if (active) {
                    setHotels(data);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    return <ul>{hotels.map(h => <li key={h.id}>{h.name}</li>)}</ul>;
}
```

The dependency array controls when the effect runs:

| Array | When |
|---|---|
| `[]` | Once after the first render |
| `[id]` | After the first render and whenever `id` changes |
| no array | After every render, usually a bug |

React StrictMode runs effects twice in development. The cleanup function and the `active` flag keep the second run from setting state after the first one is gone. This is normal, not a production bug.

Do not use an effect for a value you can calculate during render. Derive it instead.

## Fetch with loading and error states

```jsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    getHotels()
        .then(result => {
            if (active) {
                setData(result);
            }
        })
        .catch(() => {
            if (active) {
                setError('Could not load data.');
            }
        })
        .finally(() => {
            if (active) {
                setLoading(false);
            }
        });

    return () => {
        active = false;
    };
}, []);
```

Always render all three states. A blank screen during a slow request looks like a broken app.

## Axios instance

```js
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    timeout: 10000,
});

export async function getHotels() {
    const { data } = await api.get('/hotels');
    return data;
}
```

Axios throws on 4xx and 5xx, so a `catch` catches both network errors and error responses. `fetch` does not throw on 404, which is a common source of confusion.

## React Router

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/hotels/:id" element={<Bookings />} />
                <Route path="/search/:searchedWord" element={<SearchResult />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
```

`main.jsx` usually holds the `BrowserRouter` and `App` holds the `Routes`. Either split works, but keep one router.

## Route parameters and navigation

```jsx
import { Link, useNavigate, useParams } from 'react-router-dom';

function Bookings() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <>
            <Link to="/">Back</Link>
            <button onClick={() => navigate(`/hotels/${id}`)}>Open</button>
        </>
    );
}
```

`useParams` returns strings. Convert with `Number(id)` when the API needs a number.

The effect must depend on the route parameter:

```jsx
useEffect(() => {
    getBookingsByHotel(id);
}, [id]);
```

Without `[id]`, navigating from hotel 1 to hotel 2 keeps the old data.

## Encode a search word

```jsx
const word = 'Budapest center';
navigate(`/search/${encodeURIComponent(word)}`);
```

`useParams` decodes the value automatically. Without `encodeURIComponent`, a slash or a question mark breaks the route.

## Custom hook

```jsx
function useHotels() {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;
        getHotels()
            .then(data => active && setHotels(data))
            .catch(() => active && setError('Could not load hotels.'))
            .finally(() => active && setLoading(false));
        return () => {
            active = false;
        };
    }, []);

    return { hotels, loading, error };
}
```

A custom hook is a function whose name starts with `use` and that calls other hooks. It shares logic, not state. Two components that call `useHotels` get two separate states.

## Context

```jsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
    const [dark, setDark] = useState(false);
    return (
        <ThemeContext.Provider value={{ dark, setDark }}>
            {children}
        </ThemeContext.Provider>
    );
}

function Toggle() {
    const { dark, setDark } = useContext(ThemeContext);
    return <button onClick={() => setDark(!dark)}>Toggle</button>;
}
```

Use context for a value that many components need. Do not put every piece of state in a global store for a three-page exam app.

## CSS in Vite

```jsx
import './styles.css';
```

A plain CSS import applies to the whole app. Keep class names specific enough to avoid collisions. For a quick layout:

```css
.page {
    min-height: 100vh;
    padding: 96px 20px 40px;
    background: url('/backgroundImage.jpg') center / cover no-repeat;
}

.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 20px;
}
```

Vite serves files in `public/` from `/`. `url('/backgroundImage.jpg')` works when the file is `public/backgroundImage.jpg`.

## Rules of hooks

- Call hooks at the top level of a component or another hook.
- Do not call hooks inside a loop, a condition, or a nested function.
- The order must be the same on every render.
- `useState`, `useEffect`, `useContext`, `useRef`, `useMemo`, `useCallback` all follow this rule.

## useRef

```jsx
import { useEffect, useRef } from "react";

function SearchBox() {
    const inputRef = useRef(null);
    const renders = useRef(0);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    renders.current += 1;

    return <input ref={inputRef} placeholder="Search" />;
}
```

`useRef` returns an object with a `current` field. Changing `current` does not re-render. Use it for a DOM node or a value that must survive renders, such as a timer id.

## useReducer

```jsx
import { useReducer } from "react";

function reducer(state, action) {
    switch (action.type) {
        case "add":
            return { count: state.count + 1 };
        case "reset":
            return { count: 0 };
        default:
            throw new Error("Unknown action");
    }
}

function Counter() {
    const [state, dispatch] = useReducer(reducer, { count: 0 });

    return (
        <>
            <p>{state.count}</p>
            <button onClick={() => dispatch({ type: "add" })}>Add</button>
            <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
        </>
    );
}
```

Use `useReducer` when several actions change one state object, or when the next state depends on the previous one. `dispatch` sends an action; the reducer returns the new state. Keep the reducer pure.

## useContext

```jsx
import { createContext, useContext } from "react";

const ThemeContext = createContext("light");

function Toolbar() {
    const theme = useContext(ThemeContext);
    return <button className={theme}>Menu</button>;
}

function App() {
    return (
        <ThemeContext.Provider value="dark">
            <Toolbar />
        </ThemeContext.Provider>
    );
}
```

`createContext` makes the channel, `Provider` supplies the value, and `useContext` reads the nearest provider. A component that reads the context re-renders when the value changes. Do not put a new object in the value on every render unless you memoize it.

## useMemo and useCallback

```jsx
import { useCallback, useMemo } from "react";

function RoomList({ rooms, onPick }) {
    const sorted = useMemo(
        () => [...rooms].sort((a, b) => a.price - b.price),
        [rooms]
    );

    const handlePick = useCallback((id) => onPick(id), [onPick]);

    return sorted.map((room) => (
        <button key={room.id} onClick={() => handlePick(room.id)}>
            {room.name}
        </button>
    ));
}
```

`useMemo` caches a calculated value; `useCallback` caches a function. Both only help when the result is passed to a memoized child or used in a dependency array. Do not wrap every value; the dependency check has a cost.

## Class components

```jsx
import { Component } from "react";

class Counter extends Component {
    state = { count: 0 };

    add = () => {
        this.setState({ count: this.state.count + 1 });
    };

    render() {
        return <button onClick={this.add}>{this.state.count}</button>;
    }
}
```

Older React code uses classes. `state` is an object, `setState` merges a partial update, and `this` must be bound or use an arrow method. New code uses function components and hooks; read a class only when the exam or an existing file uses one.

## Portals and Suspense

```jsx
import { createPortal } from "react-dom";
import { lazy, Suspense } from "react";

const HeavyPage = lazy(() => import("./HeavyPage.jsx"));

function Modal({ children }) {
    return createPortal(children, document.getElementById("modal-root"));
}

function App() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <HeavyPage />
        </Suspense>
    );
}
```

A portal renders a child into another DOM node, which is useful for modals and tooltips. `lazy` splits a component into a separate chunk; `Suspense` shows a fallback while it loads. The target node must exist in `index.html`.

## Error boundaries

```jsx
import { Component } from "react";

class ErrorBoundary extends Component {
    state = { error: null };

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, info) {
        console.error(error, info);
    }

    render() {
        if (this.state.error) {
            return <p>Something went wrong.</p>;
        }
        return this.props.children;
    }
}
```

An error boundary catches render errors in its children. It does not catch event handler errors, async errors, or errors in itself. Wrap a route or a risky panel, not the whole app.

## React.memo, forwardRef, HOC

```jsx
import { forwardRef, memo } from "react";

const Input = forwardRef(function Input(props, ref) {
    return <input ref={ref} {...props} />;
});

const Row = memo(function Row({ room }) {
    return <li>{room.name}</li>;
});

function withTitle(Component) {
    return function Wrapped(props) {
        return (
            <>
                <h2>Rooms</h2>
                <Component {...props} />
            </>
        );
    };
}
```

`memo` skips a re-render when props are equal. `forwardRef` passes a ref through to a DOM node. A higher order component takes a component and returns a new one. Use these only when a profiler shows a problem.

## Common errors

| Error | Cause | Fix |
|---|---|---|
| `Objects are not valid as a React child` | Rendering an object or an array of objects | Render a string or map to elements |
| `Each child in a list should have a unique key` | Missing key | Add `key={item.id}` |
| `Too many re-renders` | State set during render | Move the call into an event or an effect |
| `Cannot read properties of undefined` | Data is not loaded yet | Guard with `data?.name` or an early return |
| `useEffect` runs forever | Dependency changes every render | Use a stable dependency or an empty array |
| `useParams` is empty | Component is outside the route | Put it inside the route element |
| Page is blank after refresh | Server has no SPA fallback | Rewrite to `index.html` |
| CORS error | Direct call to another origin | Use the Vite proxy or enable CORS |

## Exam checklist

1. Confirm the API returns an array with the fields you expect.
2. Build the list page with loading, error, and empty states.
3. Add the detail route and the `useEffect` dependency on `id`.
4. Add the search route and the three-character check.
5. Add the owner popup and stop its click from bubbling to the card.
6. Add the fixed navbar and the page top padding.
7. Test at 375px wide.
8. Run `npm run build`.
