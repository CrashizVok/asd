---
id: react-context
lang: React
title: Context
override: true
---

# Context

## Simplest form

```jsx
// Data shape: { theme: "light" | "dark" }
const ThemeContext = createContext("light");

// A provider supplies the value for everything below it
<ThemeContext.Provider value="dark">
    <Toolbar />
</ThemeContext.Provider>

// Any descendant reads the nearest value
const theme = useContext(ThemeContext); // "dark"
```

Three pieces, one job. `createContext` makes a named channel with a fallback, the
provider puts a value into that channel for its subtree, and `useContext` reads it
without props in between.

## What it does

Props travel one level at a time. A navbar that lives at the top of the tree and a
button buried six levels down normally pass values through every component on the
path, and every one of those components has to accept a prop it does not use.

Context removes the middle. The provider publishes a value, consumers subscribe to
it, and the components between them stay ignorant. A consumer re-renders when the
value it reads changes according to `Object.is`. Passing the same object reference
again does not re-render consumers through the context, even though the provider
itself re-renders.

The cost is coupling to a location in the tree. A component that reads context
cannot be dropped anywhere; it needs a provider above it, or it silently falls
back to the default value. Context also makes data flow less obvious when you read
a file that only contains the consumer.

## Every part

### createContext

```jsx
const ThemeContext = createContext("light");
const UserContext = createContext(null);
```

The argument is the default value, used only when no provider exists above the
consumer. It is not an initial value that the provider later replaces by state, and
it does not update. `null` is a fine default when a missing provider is a bug you
want to detect in your own hook. A string default is fine when a sensible fallback
works, such as `"light"`.

The returned object has a `Provider` property. React 19 also lets you render
`<ThemeContext value={...}>` directly, but the `.Provider` form works in every
version you will meet in an exam, so use it.

### Provider

```jsx
<ThemeContext.Provider value={{ dark, toggle }}>
    <App />
</ThemeContext.Provider>
```

`value` is the only prop that matters. Every consumer below the provider sees the
nearest provider's value, not the outermost one. Nesting is legal and useful for a
single modal that needs a different theme.

The `value` prop is compared by reference. `value={{ dark, toggle }}` creates a new
object on every render of the provider, so every consumer re-renders whenever the
provider renders for any reason. That is the most common performance complaint
about context, and the fix is in the stable value section below.

### useContext

```jsx
const theme = useContext(ThemeContext);
```

Returns the current value of the nearest provider. It does not take a selector and
it does not let you subscribe to part of an object. A consumer of
`{ user, settings, cart }` re-renders when `user` changes even if it only reads
`cart`.

The hook must be called at the top level of a component or another hook. Calling it
inside a condition or a loop breaks the hook order, the same rule that applies to
`useState`.

### A custom hook around the context

```jsx
// Data shape: { dark: boolean, toggle: () => void }
export function useTheme() {
    const value = useContext(ThemeContext);

    if (value === null) {
        throw new Error("useTheme must be used inside ThemeProvider");
    }

    return value;
}
```

The hook does two things props cannot: it gives the value a name that reads well in
a component, and it turns a missing provider into a clear error instead of an
`undefined is not an object` three lines later. Keep the context object private to
the file, export the provider and the hook. Then nothing outside can read the raw
context and skip the guard.

### Splitting context

One context with one object seems tidy until a component that only displays a count
re-renders because a callback identity changed. Two contexts cost one extra line and
remove the problem:

```jsx
const BookingStateContext = createContext(null);
const BookingActionsContext = createContext(null);
```

State goes into the first, the setter and the action functions into the second. The
actions object can be built once and never change, so components that only dispatch
never re-render when the data changes. This split of state and actions is the
cheapest performance fix in a context-heavy app, and it also documents which
components write and which only read.

### Stable value

```jsx
const value = useMemo(() => ({ dark, toggle }), [dark, toggle]);
```

Memoize the object, not every field. If `toggle` is declared with `useCallback` and
`dark` is a boolean, the object changes only when `dark` changes. Without the
memoization a new object appears on every provider render and every consumer
re-renders with it.

For a provider whose value is a plain string or number, no memoization is needed
because primitives compare by value.

## Examples

### Example 1: a provider that never renders

The default value is not decoration. It is what a consumer sees when the provider is
missing, which makes it useful for tests and for a component library that must work
standalone.

```jsx
import { createContext, useContext } from "react";

// Data shape: { locale: string }
const LocaleContext = createContext("en");

function Price({ amount }) {
    const locale = useContext(LocaleContext);

    // The same component works with or without a provider above it
    return <span>{new Intl.NumberFormat(locale).format(amount)}</span>;
}

function Standalone() {
    return <Price amount={12500} />; // "12,500" with the default "en"
}

function WithProvider() {
    return (
        <LocaleContext.Provider value="de">
            <Price amount={12500} /> {/* "12.500" */}
        </LocaleContext.Provider>
    );
}
```

### Example 2: theme with a custom hook

```jsx
import { createContext, useCallback, useContext, useMemo, useState } from "react";

// Data shape: { dark: boolean, toggle: () => void }
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [dark, setDark] = useState(false);

    // Stable identity, so consumers do not re-render when nothing changed
    const toggle = useCallback(() => setDark((old) => !old), []);

    const value = useMemo(() => ({ dark, toggle }), [dark, toggle]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const value = useContext(ThemeContext);
    if (!value) throw new Error("useTheme needs a ThemeProvider");
    return value;
}

function Header() {
    const { dark, toggle } = useTheme();

    return (
        <header className={dark ? "dark" : "light"}>
            <button onClick={toggle}>{dark ? "Light mode" : "Dark mode"}</button>
        </header>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <Header />
        </ThemeProvider>
    );
}
```

### Example 3: split state and actions

```jsx
import { createContext, useCallback, useContext, useMemo, useReducer } from "react";

// Data shape: { items: Array<{ id: number, name: string }> }
const CartStateContext = createContext(null);
// Data shape: { add: (name) => void, remove: (id) => void }
const CartActionsContext = createContext(null);

function reducer(state, action) {
    switch (action.type) {
        case "add":
            return { items: [...state.items, { id: Date.now(), name: action.name }] };
        case "remove":
            return { items: state.items.filter((item) => item.id !== action.id) };
        default:
            throw new Error(`Unknown action: ${action.type}`);
    }
}

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, { items: [] });

    const add = useCallback((name) => dispatch({ type: "add", name }), []);
    const remove = useCallback((id) => dispatch({ type: "remove", id }), []);
    const actions = useMemo(() => ({ add, remove }), [add, remove]);

    return (
        <CartActionsContext.Provider value={actions}>
            <CartStateContext.Provider value={state}>{children}</CartStateContext.Provider>
        </CartActionsContext.Provider>
    );
}

export function useCartItems() {
    const state = useContext(CartStateContext);
    if (!state) throw new Error("useCartItems needs a CartProvider");
    return state.items;
}

export function useCartActions() {
    const actions = useContext(CartActionsContext);
    if (!actions) throw new Error("useCartActions needs a CartProvider");
    return actions;
}

// Reads the list, re-renders when the list changes
function CartList() {
    const items = useCartItems();
    const { remove } = useCartActions();

    return (
        <ul>
            {items.map((item) => (
                <li key={item.id}>
                    {item.name}
                    <button onClick={() => remove(item.id)}>Remove</button>
                </li>
            ))}
        </ul>
    );
}

// Only dispatches, never re-renders because the list changed
function AddButton() {
    const { add } = useCartActions();
    return <button onClick={() => add("Breakfast")}>Add breakfast</button>;
}
```

`CartList` re-renders when the array changes because it reads the state context.
`AddButton` reads only the actions context, whose object is memoized and never
changes, so it renders once and stays still while the list is edited.

### Example 4: a small booking dashboard, fully commented

The file below is the whole app. Read it in order: two contexts, one provider that
holds the data, three consumers that each take only what they need, and a page
component that composes them.

```jsx
// App.jsx
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useReducer,
} from "react";

// ---------------------------------------------------------------
// 1. The data. One reducer owns every write, so the transitions
//    stay in a single place and are easy to test without React.
// ---------------------------------------------------------------

// Data shape:
// {
//   city: string,
//   rooms: Array<{ id: number, name: string, city: string, stars: number }>,
//   saved: number[]            // room ids the visitor marked
// }

const initialState = {
    city: "",
    rooms: [
        { id: 1, name: "Danube View", city: "Budapest", stars: 4 },
        { id: 2, name: "Hilltop Inn", city: "Eger", stars: 3 },
        { id: 3, name: "Lake House", city: "Balaton", stars: 5 },
    ],
    saved: [],
};

function roomsReducer(state, action) {
    switch (action.type) {
        case "city":
            return { ...state, city: action.city };
        case "save":
            // Toggle membership without touching the original array
            return state.saved.includes(action.id)
                ? { ...state, saved: state.saved.filter((id) => id !== action.id) }
                : { ...state, saved: [...state.saved, action.id] };
        case "clear":
            return { ...state, city: "", saved: [] };
        default:
            throw new Error(`Unknown action: ${action.type}`);
    }
}

// ---------------------------------------------------------------
// 2. Two contexts. State for readers, actions for writers. A
//    component that only calls save() never re-renders when the
//    city filter changes.
// ---------------------------------------------------------------

const RoomsStateContext = createContext(null);
const RoomsActionsContext = createContext(null);

function RoomsProvider({ children }) {
    const [state, dispatch] = useReducer(roomsReducer, initialState);

    // useCallback keeps each action identical between renders
    const setCity = useCallback((city) => dispatch({ type: "city", city }), []);
    const save = useCallback((id) => dispatch({ type: "save", id }), []);
    const clear = useCallback(() => dispatch({ type: "clear" }), []);

    const actions = useMemo(
        () => ({ setCity, save, clear }),
        [setCity, save, clear]
    );

    // The state context value is the raw reducer state. It changes
    // only when the reducer returns a new object, which is exactly
    // when consumers should render again.
    return (
        <RoomsActionsContext.Provider value={actions}>
            <RoomsStateContext.Provider value={state}>{children}</RoomsStateContext.Provider>
        </RoomsActionsContext.Provider>
    );
}

// Two hooks instead of one, so a component can pick its side.
function useRoomsState() {
    const state = useContext(RoomsStateContext);
    if (!state) throw new Error("useRoomsState needs RoomsProvider");
    return state;
}

function useRoomsActions() {
    const actions = useContext(RoomsActionsContext);
    if (!actions) throw new Error("useRoomsActions needs RoomsProvider");
    return actions;
}

// ---------------------------------------------------------------
// 3. Consumers. Each one reads the smallest slice it can.
// ---------------------------------------------------------------

function CityFilter() {
    const { city } = useRoomsState();
    const { setCity, clear } = useRoomsActions();

    return (
        <div className="filter">
            <input
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="Filter by city"
            />
            <button onClick={clear}>Clear</button>
        </div>
    );
}

function RoomList() {
    const { rooms, city, saved } = useRoomsState();
    const { save } = useRoomsActions();

    // Derived data is computed during render, not stored in state.
    // useMemo only pays off when the list is long; here it also
    // documents that the filter is the expensive part.
    const visible = useMemo(() => {
        const needle = city.trim().toLowerCase();
        if (!needle) return rooms;
        return rooms.filter((room) => room.city.toLowerCase().includes(needle));
    }, [rooms, city]);

    if (visible.length === 0) {
        return <p>No room matches "{city}".</p>;
    }

    return (
        <ul className="rooms">
            {visible.map((room) => (
                <li key={room.id}>
                    <strong>{room.name}</strong> {room.city}, {room.stars} stars
                    <button onClick={() => save(room.id)}>
                        {saved.includes(room.id) ? "Unsave" : "Save"}
                    </button>
                </li>
            ))}
        </ul>
    );
}

// Reads the state, so it re-renders on any change to the object,
// including one that does not touch "saved". A third context would
// be the next split if the list grew.
function SavedCount() {
    const { saved } = useRoomsState();
    return <p>{saved.length} saved</p>;
}

// ---------------------------------------------------------------
// 4. Page and entry point. The provider goes above every consumer.
// ---------------------------------------------------------------

export default function App() {
    return (
        <RoomsProvider>
            <main>
                <h1>Find a room</h1>
                <CityFilter />
                <RoomList />
                <SavedCount />
            </main>
        </RoomsProvider>
    );
}
```

The parts worth noticing on a second read. `RoomsProvider` never stores derived
data: the filter result is computed in `RoomList`. The `saved` array is replaced,
never mutated, so React sees a new reference and the list updates. `SavedCount`
re-renders when `saved` changes because the whole state object is the value, and
that is acceptable here; a separate `SavedContext` would be the next step if the
list were large.

## Common mistakes

- Creating the context inside a component. The object is rebuilt on every render,
  the provider publishes a new channel, and every consumer remounts. Declare it at
  module level.
- Passing a fresh object to `value` without `useMemo`. Every provider render makes
  every consumer render, and `React.memo` on children stops helping.
- Forgetting the default value. `createContext()` with no argument gives
  `undefined`, and a consumer outside a provider fails with a message that does not
  mention context.
- Reading context in a component that could just take a prop. Two levels of props
  are cheaper to follow than a hidden dependency.
- Putting form input state in context. Every keystroke then re-renders the whole
  subtree. Keep draft state local and publish only the submitted value.
- Assuming `useContext` re-renders only when the field you read changes. It
  re-renders on any change to the value object, which is why the state and actions
  split exists.
- Calling `useContext` inside a condition. Hooks must run in the same order on every
  render.
- Nesting a provider by accident and wondering why the outer value is ignored. The
  nearest provider wins, so a second provider in a modal silently overrides.
- Treating context as a store. It holds a value; it does not fetch, cache, or
  invalidate anything. Data fetching and caching stay in your own code or in a
  library.

## Exam checklist

- Can you name the three parts and what each one does in one sentence?
- Can you write a provider with a memoized object value and a matching custom hook
  with a guard, without looking at notes?
- Do you know that the `createContext` argument is a fallback, not initial state?
- Do you know that the nearest provider wins, and that providers can nest?
- Can you explain why a new object in `value` re-renders every consumer?
- Can you split one context into state and actions and say which component benefits?
- Can you explain why a consumer of a big object re-renders when an unrelated field
  changes?
- Can you point at the place where a component outside the provider would crash, and
  say what the error would be?
- Does your example work if the provider is removed and the default value is used?
