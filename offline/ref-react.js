(function () {
    const lang = 'React';

    const entries = [
        {
            id: 'react-jsx',
            group: 'Basics',
            name: 'JSX',
            syntax: 'const el = <h1>Hello</h1>;',
            desc: 'JSX looks like HTML inside JavaScript. It becomes React.createElement calls. Use className instead of class and htmlFor instead of for.',
            example: 'const name = "Anna";\nconst card = (\n  <div className="card">\n    <h2>{name}</h2>\n    <p>Welcome.</p>\n  </div>\n);'
        },
        {
            id: 'react-expression',
            group: 'Basics',
            name: 'expressions in JSX',
            syntax: '{expression}',
            desc: 'Curly braces run a JavaScript expression inside JSX. Statements such as if cannot go inside the braces.',
            example: 'const stars = 4;\n\n<p>\n  {stars} out of 5\n  {stars >= 4 ? " (great)" : ""}\n</p>'
        },
        {
            id: 'react-fragment',
            group: 'Basics',
            name: 'fragment',
            syntax: '<> ... </>',
            desc: 'Groups several elements without adding a wrapper div to the DOM.',
            example: 'return (\n  <>\n    <h1>Hotels</h1>\n    <p>Choose one.</p>\n  </>\n);'
        },
        {
            id: 'react-component',
            group: 'Components',
            name: 'function component',
            syntax: 'function Card() { return <div />; }',
            desc: 'A component is a function that returns JSX. Its name must start with a capital letter.',
            example: 'function HotelCard({ name, stars }) {\n  return (\n    <article className="card">\n      <h2>{name}</h2>\n      <p>{stars} stars</p>\n    </article>\n  );\n}\n\nexport default HotelCard;'
        },
        {
            id: 'react-props',
            group: 'Components',
            name: 'props',
            syntax: '<Card name="Danube View" stars={4} />',
            desc: 'Props pass data from a parent to a child. They are read-only. Destructure them for shorter code.',
            example: 'function Card({ name, stars = 3, children }) {\n  return (\n    <article>\n      <h2>{name}</h2>\n      <p>{stars} stars</p>\n      {children}\n    </article>\n  );\n}\n\n<Card name="Danube View" stars={4}>Extra text</Card>'
        },
        {
            id: 'react-children',
            group: 'Components',
            name: 'children',
            syntax: '<Card>content</Card>',
            desc: 'children is the content between the opening and closing tags. It can be text, elements, or components.',
            example: 'function Panel({ title, children }) {\n  return (\n    <section className="panel">\n      <h2>{title}</h2>\n      {children}\n    </section>\n  );\n}\n\n<Panel title="Bookings"><p>No bookings yet.</p></Panel>'
        },
        {
            id: 'react-usestate',
            group: 'State',
            name: 'useState',
            syntax: 'const [value, setValue] = useState(initial);',
            desc: 'Adds state to a function component. The setter replaces the value and triggers a re-render. Use the updater form when the next value depends on the old one.',
            example: 'import { useState } from "react";\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <button onClick={() => setCount((old) => old + 1)}>\n      Clicked {count} times\n    </button>\n  );\n}'
        },
        {
            id: 'react-state-object',
            group: 'State',
            name: 'state with an object',
            syntax: 'setUser({ ...user, name: "Anna" })',
            desc: 'State updates are shallow. Spread the old object and change only the field you need.',
            example: 'const [user, setUser] = useState({ name: "Anna", city: "Budapest" });\n\nfunction changeCity() {\n  setUser((old) => ({ ...old, city: "Debrecen" }));\n}'
        },
        {
            id: 'react-state-array',
            group: 'State',
            name: 'state with an array',
            syntax: 'setItems([...items, newItem])',
            desc: 'Do not mutate state arrays. Create a new array with spread, filter, or map.',
            example: 'const [items, setItems] = useState([]);\n\nfunction add(name) {\n  setItems((old) => [...old, { id: crypto.randomUUID(), name }]);\n}\n\nfunction remove(id) {\n  setItems((old) => old.filter((item) => item.id !== id));\n}'
        },
        {
            id: 'react-event',
            group: 'Events',
            name: 'event handler',
            syntax: '<button onClick={handleClick}>Save</button>',
            desc: 'React events use camelCase: onClick, onChange, onSubmit. Pass the function, not the result of calling it.',
            example: 'function Form() {\n  function handleSubmit(event) {\n    event.preventDefault();\n    console.log("sent");\n  }\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <button type="submit">Save</button>\n    </form>\n  );\n}'
        },
        {
            id: 'react-event-argument',
            group: 'Events',
            name: 'passing an argument',
            syntax: 'onClick={() => remove(id)}',
            desc: 'Wrap the call in an arrow function when the handler needs an argument. Otherwise it runs during render.',
            example: 'function List({ items, onRemove }) {\n  return (\n    <ul>\n      {items.map((item) => (\n        <li key={item.id}>\n          {item.name}\n          <button onClick={() => onRemove(item.id)}>Remove</button>\n        </li>\n      ))}\n    </ul>\n  );\n}'
        },
        {
            id: 'react-lists',
            group: 'Rendering',
            name: 'lists and keys',
            syntax: 'items.map(item => <li key={item.id}>{item.name}</li>)',
            desc: 'Render lists with map. Every item needs a stable key. Use a database id, not the array index, when the list can change.',
            example: 'function HotelList({ hotels }) {\n  return (\n    <ul>\n      {hotels.map((hotel) => (\n        <li key={hotel.id}>{hotel.name}</li>\n      ))}\n    </ul>\n  );\n}'
        },
        {
            id: 'react-conditional',
            group: 'Rendering',
            name: 'conditional rendering',
            syntax: '{loading && <p>Loading...</p>}\n{error ? <Error /> : <List />}',
            desc: 'Use && for a simple show/hide and a ternary when there are two alternatives. Do not put a number on the left of && because 0 renders.',
            example: 'function Results({ loading, error, items }) {\n  if (loading) return <p>Loading...</p>;\n  if (error) return <p className="error">{error}</p>;\n  if (!items.length) return <p>No results.</p>;\n\n  return <List items={items} />;\n}'
        },
        {
            id: 'react-controlled-input',
            group: 'Forms',
            name: 'controlled input',
            syntax: '<input value={value} onChange={e => setValue(e.target.value)} />',
            desc: 'React state is the single source of truth. value plus onChange keeps the input and state in sync.',
            example: 'function Search() {\n  const [word, setWord] = useState("");\n\n  return (\n    <input\n      value={word}\n      onChange={(event) => setWord(event.target.value)}\n      placeholder="Search"\n    />\n  );\n}'
        },
        {
            id: 'react-form-submit',
            group: 'Forms',
            name: 'form submit',
            syntax: '<form onSubmit={handleSubmit}>',
            desc: 'Call event.preventDefault() to stop the page reload. Read values from state or FormData.',
            example: 'function BookingForm() {\n  const [email, setEmail] = useState("");\n\n  function handleSubmit(event) {\n    event.preventDefault();\n    console.log({ email });\n  }\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input value={email} onChange={(e) => setEmail(e.target.value)} />\n      <button type="submit">Save</button>\n    </form>\n  );\n}'
        },
        {
            id: 'react-select-checkbox',
            group: 'Forms',
            name: 'select and checkbox',
            syntax: '<select value={value} onChange={...}>',
            desc: 'Select uses value and onChange. Checkbox uses checked and onChange with event.target.checked.',
            example: '<select value={city} onChange={(e) => setCity(e.target.value)}>\n  <option value="budapest">Budapest</option>\n  <option value="debrecen">Debrecen</option>\n</select>\n\n<input\n  type="checkbox"\n  checked={agree}\n  onChange={(e) => setAgree(e.target.checked)}\n/>'
        },
        {
            id: 'react-useeffect',
            group: 'Effects',
            name: 'useEffect',
            syntax: 'useEffect(() => { ... }, [deps]);',
            desc: 'Runs side effects after render. The dependency array controls when it runs. Return a cleanup function for timers, subscriptions, or requests.',
            example: 'import { useEffect, useState } from "react";\n\nfunction Hotels() {\n  const [hotels, setHotels] = useState([]);\n\n  useEffect(() => {\n    let active = true;\n    fetch("/api/hotels")\n      .then((response) => response.json())\n      .then((data) => {\n        if (active) setHotels(data);\n      });\n\n    return () => {\n      active = false;\n    };\n  }, []);\n\n  return <List items={hotels} />;\n}'
        },
        {
            id: 'react-useeffect-deps',
            group: 'Effects',
            name: 'effect dependencies',
            syntax: 'useEffect(fn, [id])',
            desc: 'An empty array runs once after mount. [id] runs when id changes. No array runs after every render. Include every value the effect reads.',
            example: 'useEffect(() => {\n  loadBookings(id);\n}, [id]);\n\nuseEffect(() => {\n  const timer = setInterval(tick, 1000);\n  return () => clearInterval(timer);\n}, []);'
        },
        {
            id: 'react-loading-error',
            group: 'Effects',
            name: 'loading, error, empty states',
            syntax: 'if (loading) ... if (error) ... if (!items.length) ...',
            desc: 'Every fetch needs three states: loading, error, and empty. The exam checks them.',
            example: 'const [loading, setLoading] = useState(true);\nconst [error, setError] = useState("");\nconst [items, setItems] = useState([]);\n\nif (loading) return <p>Loading...</p>;\nif (error) return <p className="error">{error}</p>;\nif (!items.length) return <p>No bookings yet.</p>;'
        },
        {
            id: 'react-useref',
            group: 'Hooks',
            name: 'useRef',
            syntax: 'const ref = useRef(null);',
            desc: 'Holds a value between renders without causing a re-render. Use it for DOM nodes, timers, or the previous value.',
            example: 'import { useRef } from "react";\n\nfunction SearchBox() {\n  const inputRef = useRef(null);\n\n  return (\n    <>\n      <input ref={inputRef} />\n      <button onClick={() => inputRef.current.focus()}>Focus</button>\n    </>\n  );\n}'
        },
        {
            id: 'react-usereducer',
            group: 'Hooks',
            name: 'useReducer',
            syntax: 'const [state, dispatch] = useReducer(reducer, initial);',
            desc: 'Manages complex state with actions. The reducer returns the next state and must not mutate the old one.',
            example: 'function reducer(state, action) {\n  switch (action.type) {\n    case "inc":\n      return { count: state.count + 1 };\n    case "reset":\n      return { count: 0 };\n    default:\n      return state;\n  }\n}\n\nconst [state, dispatch] = useReducer(reducer, { count: 0 });\ndispatch({ type: "inc" });'
        },
        {
            id: 'react-usecontext',
            group: 'Hooks',
            name: 'useContext',
            syntax: 'const value = useContext(MyContext);',
            desc: 'Reads a value from the nearest provider without passing props through every level.',
            example: 'const ThemeContext = createContext("light");\n\nfunction Button() {\n  const theme = useContext(ThemeContext);\n  return <button className={theme}>Save</button>;\n}\n\n<ThemeContext.Provider value="dark">\n  <Button />\n</ThemeContext.Provider>'
        },
        {
            id: 'react-usememo',
            group: 'Hooks',
            name: 'useMemo',
            syntax: 'const value = useMemo(() => compute(a), [a]);',
            desc: 'Caches the result of an expensive calculation until a dependency changes. Do not use it for every small value.',
            example: 'const sorted = useMemo(() => {\n  return [...hotels].sort((a, b) => a.name.localeCompare(b.name));\n}, [hotels]);'
        },
        {
            id: 'react-usecallback',
            group: 'Hooks',
            name: 'useCallback',
            syntax: 'const fn = useCallback(() => { ... }, [deps]);',
            desc: 'Caches a function between renders. Use it when passing callbacks to memoized children.',
            example: 'const handleRemove = useCallback((id) => {\n  setItems((old) => old.filter((item) => item.id !== id));\n}, []);'
        },
        {
            id: 'react-custom-hook',
            group: 'Hooks',
            name: 'custom hook',
            syntax: 'function useThing() { ... return value; }',
            desc: 'A function whose name starts with use and calls other hooks. It shares logic, not state.',
            example: 'function useHotels() {\n  const [hotels, setHotels] = useState([]);\n\n  useEffect(() => {\n    fetch("/api/hotels")\n      .then((response) => response.json())\n      .then(setHotels);\n  }, []);\n\n  return hotels;\n}\n\nconst hotels = useHotels();'
        },
        {
            id: 'react-router-setup',
            group: 'Routing',
            name: 'BrowserRouter and Routes',
            syntax: '<BrowserRouter><Routes><Route ... /></Routes></BrowserRouter>',
            desc: 'React Router maps URLs to components. BrowserRouter uses the History API; HashRouter works on static file hosts.',
            example: 'import { BrowserRouter, Routes, Route } from "react-router-dom";\n\n<BrowserRouter>\n  <Routes>\n    <Route path="/" element={<Home />} />\n    <Route path="/hotels/:id" element={<Bookings />} />\n  </Routes>\n</BrowserRouter>'
        },
        {
            id: 'react-router-link',
            group: 'Routing',
            name: 'Link and NavLink',
            syntax: '<Link to="/hotels">Hotels</Link>',
            desc: 'Link navigates without a full page reload. NavLink adds an active class.',
            example: 'import { Link, NavLink } from "react-router-dom";\n\n<Link to="/hotels">All hotels</Link>\n<NavLink to="/search" className={({ isActive }) => isActive ? "active" : ""}>\n  Search\n</NavLink>'
        },
        {
            id: 'react-router-params',
            group: 'Routing',
            name: 'useParams',
            syntax: 'const { id } = useParams();',
            desc: 'Reads dynamic segments from the route path. The parameter name must match the path.',
            example: '<Route path="/hotels/:id" element={<Bookings />} />\n\nfunction Bookings() {\n  const { id } = useParams();\n  useEffect(() => {\n    loadBookings(id);\n  }, [id]);\n}'
        },
        {
            id: 'react-router-navigate',
            group: 'Routing',
            name: 'useNavigate',
            syntax: 'const navigate = useNavigate();\nnavigate("/hotels/1");',
            desc: 'Navigates from code, for example after a form submit or a search.',
            example: 'const navigate = useNavigate();\n\nfunction handleSearch(event) {\n  event.preventDefault();\n  const word = input.trim();\n  if (word.length < 3) return;\n  navigate(`/search/${encodeURIComponent(word)}`);\n}'
        },
        {
            id: 'react-router-searchparams',
            group: 'Routing',
            name: 'useSearchParams',
            syntax: 'const [params, setParams] = useSearchParams();',
            desc: 'Reads and writes the query string, such as ?page=2. Useful for filters and pagination.',
            example: 'const [params, setParams] = useSearchParams();\nconst page = Number(params.get("page")) || 1;\n\nfunction next() {\n  setParams({ page: String(page + 1) });\n}'
        },
        {
            id: 'react-context',
            group: 'Patterns',
            name: 'createContext and Provider',
            syntax: 'const Ctx = createContext(null);\n<Ctx.Provider value={value}>',
            desc: 'Shares a value with a tree of components. Use it for theme, language, or the current user, not for every prop.',
            example: 'const UserContext = createContext(null);\n\nfunction App() {\n  const [user, setUser] = useState({ name: "Anna" });\n\n  return (\n    <UserContext.Provider value={{ user, setUser }}>\n      <Profile />\n    </UserContext.Provider>\n  );\n}'
        },
        {
            id: 'react-memo',
            group: 'Patterns',
            name: 'React.memo',
            syntax: 'const Card = memo(function Card(props) { ... });',
            desc: 'Skips a re-render when the props are shallow equal. Use it only for components that render often.',
            example: 'const HotelCard = memo(function HotelCard({ hotel }) {\n  return <article>{hotel.name}</article>;\n});'
        },
        {
            id: 'react-forwardref',
            group: 'Patterns',
            name: 'forwardRef',
            syntax: 'const Input = forwardRef((props, ref) => <input ref={ref} />);',
            desc: 'Passes a ref through a component to a DOM node. React 19 also accepts ref as a normal prop.',
            example: 'const Input = forwardRef(function Input(props, ref) {\n  return <input ref={ref} {...props} />;\n});\n\nconst ref = useRef(null);\n<Input ref={ref} />'
        },
        {
            id: 'react-lazy-suspense',
            group: 'Patterns',
            name: 'lazy and Suspense',
            syntax: 'const Page = lazy(() => import("./Page"));\n<Suspense fallback={<p>Loading...</p>}>',
            desc: 'Loads a component only when it is needed. Suspense shows a fallback while the code loads.',
            example: 'const Bookings = lazy(() => import("./pages/Bookings"));\n\n<Suspense fallback={<p>Loading...</p>}>\n  <Bookings />\n</Suspense>'
        },
        {
            id: 'react-portal',
            group: 'Patterns',
            name: 'createPortal',
            syntax: 'createPortal(<Modal />, document.body)',
            desc: 'Renders a child outside the parent DOM hierarchy. Useful for modals and tooltips that must escape overflow or z-index.',
            example: 'import { createPortal } from "react-dom";\n\nfunction Modal({ children }) {\n  return createPortal(\n    <div className="modal-overlay">{children}</div>,\n    document.body\n  );\n}'
        },
        {
            id: 'react-error-boundary',
            group: 'Patterns',
            name: 'error boundary',
            syntax: 'class Boundary extends React.Component { componentDidCatch() {} }',
            desc: 'Catches render errors in its child tree. It must be a class component. It does not catch event handler errors.',
            example: 'class ErrorBoundary extends React.Component {\n  state = { hasError: false };\n\n  static getDerivedStateFromError() {\n    return { hasError: true };\n  }\n\n  componentDidCatch(error) {\n    console.error(error);\n  }\n\n  render() {\n    return this.state.hasError ? <p>Something broke.</p> : this.props.children;\n  }\n}'
        },
        {
            id: 'react-css',
            group: 'Patterns',
            name: 'CSS in React',
            syntax: 'import "./styles.css";\n<div className="card" />',
            desc: 'Import a CSS file in the component or entry file. Use className, not class. Inline styles use an object with camelCase keys.',
            example: 'import "./styles.css";\n\n<div className="card" style={{ padding: 16, borderRadius: 12 }}>\n  <h2>Hotel</h2>\n</div>'
        },
        {
            id: 'react-forms-validation',
            group: 'Patterns',
            name: 'form validation',
            syntax: 'if (!email.includes("@")) setError("Bad email");',
            desc: 'Validate before sending. Show the error next to the field and disable the submit button when needed.',
            example: 'function validate(email) {\n  if (!email.trim()) return "Email is required.";\n  if (!email.includes("@")) return "Email looks wrong.";\n  return "";\n}\n\nconst error = validate(email);\n<button disabled={Boolean(error)}>Save</button>'
        },
        {
            id: 'react-rules',
            group: 'Patterns',
            name: 'rules of hooks',
            syntax: 'Call hooks at the top level.',
            desc: 'Do not call hooks inside conditions, loops, or nested functions. The order must be the same on every render. Custom hooks start with use.',
            example: 'function Good({ show }) {\n  const [count, setCount] = useState(0);\n  useEffect(() => {}, []);\n  return show ? <p>{count}</p> : null;\n}\n\n// Do not do this:\n// if (show) { useState(0); }'
        }
    ];

    window.WIKI_REFERENCE = (window.WIKI_REFERENCE || []).concat(
        entries.map((entry) => ({ lang, ...entry }))
    );
})();
