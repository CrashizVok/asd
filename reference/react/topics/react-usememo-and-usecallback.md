# useMemo and useCallback

React topic · Exam Wiki

## Simplest form

```jsx
// Data shape: { room: { id, name }, onPick: (id) => void }
// React.memo: skip a re-render when props stay equal (shallow compare)
const Row = memo(RowBase);

// useMemo: keep a calculated value until a dependency changes
const sorted = useMemo(() => [...rooms].sort(byPrice), [rooms]);

// useCallback: keep the same function object until a dependency changes
const onPick = useCallback((id) => select(id), [select]);
```

All three answer one question: is this thing the same as last render? `memo`
compares props, `useMemo` compares the dependencies of a value, `useCallback` is
`useMemo` for a function.

## What it does

A parent render re-renders its children. That is normal and usually cheap. It
becomes visible when a child renders a long list, runs a heavy calculation, or
sits in a chart that redraws on every keystroke.

`memo` tells React to render a child only when its props change. It is a shallow
comparison: each prop is checked with `Object.is`, one level deep. A new array, a
new object, or a new arrow function counts as a change even when the content is
identical. That is why `memo` alone often does nothing: the parent recreates the
props on every render, so the comparison fails every time.

`useMemo` and `useCallback` exist to make those props stable. They do not make
rendering faster by themselves. A memoized value still costs one dependency check
per render, and the calculation is still there on the first render or when a
dependency moves. Used on a trivial expression they add overhead and noise.

The rule that survives every exam: measure first, then memoize the boundary where
an expensive child receives props that change without a reason.

## Every part

### React.memo

```jsx
const Row = memo(function Row({ room, onPick }) {
    return (
        <li>
            {room.name}
            <button onClick={() => onPick(room.id)}>Open</button>
        </li>
    );
});
```

The component is wrapped at definition time, not at use time. `memo` returns a new
component; the inner function is not exported directly.

A second argument replaces the comparison:

```jsx
const Row = memo(RowBase, (prev, next) => prev.room.id === next.room.id);
```

Use a custom comparison only with a clear reason, and make it cheap. A comparison
that walks a large object can cost more than the render it avoids. It is also easy
to get wrong: return `true` when the props are equal, which is the opposite of the
usual `shouldComponentUpdate` intuition.

`memo` does not stop a component from re-rendering when its own state changes, when
a context it reads changes, or when a parent renders new children into it.

### What makes memo fail

```jsx
<Row room={room} onPick={(id) => pick(id)} style={{ color: "red" }} />
```

Every one of those three props is new on each parent render. Fix them in this
order: move the handler out with `useCallback`, move the object or array into a
module constant or a `useMemo`, and pass a primitive instead of an object when the
component only needs one field.

`children` is a prop too. `<Panel><Row /></Panel>` builds a new element on every
parent render, so a memoized `Panel` still re-renders. Split the panel so the
expensive part is not inside the part that re-renders, or pass the child element
from a place that does not re-render.

### useMemo

```jsx
const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rooms.filter((room) => room.name.toLowerCase().includes(needle));
}, [rooms, query]);
```

The function runs during render and must be pure. No `setState`, no fetch, no
`localStorage` write inside it. React is allowed to throw the cached value away, for
example when a component is offscreen, so the value must be safe to recompute at any
time.

Do not use `useMemo` for a side effect. `useEffect` is the hook for effects; using
`useMemo` for a fetch produces a call during render, which is a bug that appears
twice under StrictMode.

When the calculation does not depend on props or state, hoist it out of the
component instead. A module constant beats `useMemo` with `[]`.

### useCallback

```jsx
const handleSearch = useCallback(
    (value) => {
        setQuery(value);
        onSearch?.(value);
    },
    [onSearch]
);
```

`useCallback(fn, deps)` is identical to `useMemo(() => fn, deps)`. Reach for it when
the function is a prop of a memoized child, a dependency of another hook, or a
value in a context object.

It is not needed for a handler used only on a plain DOM element:

```jsx
<button onClick={() => setOpen(true)}>Open</button>
```

That arrow is recreated every render, and nobody compares it. Wrapping it adds code
with no benefit.

### Dependency arrays

Every value read inside the callback or the memo goes in the array: props, state,
functions from the same component, module-level imports excluded. The React lint
rule enforces this and it is right.

```jsx
// Wrong: reads query, lists nothing
const filtered = useMemo(() => rooms.filter((r) => r.city === query), []);

// Right
const filtered = useMemo(() => rooms.filter((r) => r.city === query), [query, rooms]);
```

The array is compared element by element with `Object.is`. Two empty arrays are
always equal, so `[]` means "compute once". An omitted array means "recompute on
every render" for `useMemo`, and for `useCallback` it means "new function every
render", which defeats the purpose.

Never put a value in the array that is recreated every render, such as an inline
object or an unmemoized function, unless you want the memo to be pointless. When
the array grows because of a function, wrap that function in `useCallback`.

Changing the number of hooks or the array length between renders is an error. React
counts hooks by order.

### Stale closures

A closure captures the values from the render that created it. A function memoized
with `[]` keeps the first render's values forever.

```jsx
useEffect(() => {
    const id = setInterval(() => {
        setCount(count + 1); // count is frozen at 0
    }, 1000);
    return () => clearInterval(id);
}, []); // the count above never updates
```

The interval fires, reads `count` from the first render, and sets it to `1` over and
over. Three fixes, in order of preference:

```jsx
// 1. Functional update: no outside value is read
useEffect(() => {
    const id = setInterval(() => setCount((old) => old + 1), 1000);
    return () => clearInterval(id);
}, []);

// 2. Add the dependency and rebuild the effect when it changes
useEffect(() => {
    const id = setInterval(() => setCount(count + 1), 1000);
    return () => clearInterval(id);
}, [count]);

// 3. A ref when the value must be read without restarting the effect
const countRef = useRef(count);
countRef.current = count;

useEffect(() => {
    const id = setInterval(() => setCount(countRef.current + 1), 1000);
    return () => clearInterval(id);
}, []);
```

The same trap appears in event listeners registered once, in debounce callbacks, and
in `setTimeout` scheduled from a memoized handler. If an inner function reads a
value that changes, either it belongs in the dependency array, or it must be
accessed through an updater or a ref.

### Performance mistakes that memoization cannot fix

- A list without keys, or with the array index as key, remounts rows and destroys
  their state.
- A context value object recreated on every provider render. Fix the provider, not
  the consumers.
- Computing a filter five times inside one render body. Compute once and pass it
  down.
- Rendering a thousand rows. Window the list or paginate; `memo` on each row still
  costs a comparison a thousand times.
- Storing derived data in state and syncing it with an effect. Compute it during
  render.

## Examples

### Example 1: memo that does nothing, then memo that works

```jsx
import { memo, useCallback, useState } from "react";

// A deliberately slow child: pretend it draws a chart
const Chart = memo(function Chart({ points, onRefresh }) {
    console.log("Chart render");
    return (
        <div>
            <p>{points.length} points</p>
            <button onClick={onRefresh}>Refresh</button>
        </div>
    );
});

function BadParent() {
    const [text, setText] = useState("");

    // New array and new function each render: memo never helps
    return (
        <>
            <input value={text} onChange={(event) => setText(event.target.value)} />
            <Chart points={[1, 2, 3]} onRefresh={() => console.log("refresh")} />
        </>
    );
}

const POINTS = [1, 2, 3];

function GoodParent() {
    const [text, setText] = useState("");

    const onRefresh = useCallback(() => console.log("refresh"), []);

    // Constant array, stable function: typing no longer renders Chart
    return (
        <>
            <input value={text} onChange={(event) => setText(event.target.value)} />
            <Chart points={POINTS} onRefresh={onRefresh} />
        </>
    );
}
```

Type into both inputs and watch the console. `BadParent` logs on every keystroke.
`GoodParent` logs once.

### Example 2: memoizing a real calculation

```jsx
import { useMemo, useState } from "react";

// Data shape: Array<{ id: number, name: string, stars: number, price: number }>
const rooms = [
    { id: 1, name: "Danube View", stars: 4, price: 82 },
    { id: 2, name: "Hilltop Inn", stars: 3, price: 54 },
    { id: 3, name: "Lake House", stars: 5, price: 130 },
];

function RoomTable() {
    const [query, setQuery] = useState("");
    const [ascending, setAscending] = useState(true);

    const visible = useMemo(() => {
        const needle = query.trim().toLowerCase();
        const filtered = needle
            ? rooms.filter((room) => room.name.toLowerCase().includes(needle))
            : rooms;

        // Sort a copy: sort mutates, and rooms is module level
        return [...filtered].sort((a, b) =>
            ascending ? a.price - b.price : b.price - a.price
        );
    }, [query, ascending]);

    return (
        <>
            <input value={query} onChange={(event) => setQuery(event.target.value)} />
            <button onClick={() => setAscending((old) => !old)}>
                {ascending ? "Cheapest first" : "Most expensive first"}
            </button>
            <ul>
                {visible.map((room) => (
                    <li key={room.id}>
                        {room.name} from {room.price}
                    </li>
                ))}
            </ul>
        </>
    );
}
```

Here the memo earns its place because sorting is the part that grows with the data,
and the component also re-renders for the input. For three rooms it is not
measurable; for three thousand it is.

### Example 3: a stale closure in a search delay

```jsx
import { useEffect, useRef, useState } from "react";

function SearchBox({ onSearch }) {
    const [text, setText] = useState("");
    const latestSearch = useRef(onSearch);

    // Keep the ref pointing at the newest prop without restarting the timer
    latestSearch.current = onSearch;

    useEffect(() => {
        if (text.length < 3) return;

        // The timer reads latestSearch.current at fire time, not at setup time
        const id = setTimeout(() => {
            latestSearch.current(text);
        }, 400);

        return () => clearTimeout(id);
    }, [text]); // text changed, so the old timer must die

    return (
        <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="City"
        />
    );
}
```

Two closures, two rules. `text` is in the dependency array because the effect should
restart when it changes. `onSearch` is not, because a new function from the parent
would otherwise cancel and restart the timer on every parent render; the ref carries
the newest version across renders instead.

### Example 4: a searchable room list, fully commented

One file, four components, and the memo boundaries marked where they matter. The
parent owns state; the memoized row owns nothing.

```jsx
// RoomBrowser.jsx
import { memo, useCallback, useMemo, useState } from "react";

// Data shape:
// Array<{ id: number, name: string, city: string, stars: number, price: number }>
const rooms = [
    { id: 1, name: "Danube View", city: "Budapest", stars: 4, price: 82 },
    { id: 2, name: "Hilltop Inn", city: "Eger", stars: 3, price: 54 },
    { id: 3, name: "Lake House", city: "Balaton", stars: 5, price: 130 },
    { id: 4, name: "Station Rooms", city: "Budapest", stars: 2, price: 41 },
];

// ---------------------------------------------------------------
// 1. The row. memo means: render only when room, selected, or
//    onSelect changes. onSelect must be stable, or this does
//    nothing at all.
// ---------------------------------------------------------------
const RoomRow = memo(function RoomRow({ room, selected, onSelect }) {
    console.log("row", room.id);

    return (
        <li className={selected ? "row row--selected" : "row"}>
            <button onClick={() => onSelect(room.id)}>
                <strong>{room.name}</strong> {room.city}, {room.stars} stars, from{" "}
                {room.price}
            </button>
        </li>
    );
});

// ---------------------------------------------------------------
// 2. The toolbar. It owns neither list nor selection, so a
//    keystroke here re-renders only this component and its parent
//    keeps its handlers stable through useCallback.
// ---------------------------------------------------------------
function Toolbar({ query, onQuery, onlyCheap, onOnlyCheap }) {
    return (
        <div className="toolbar">
            <input
                value={query}
                onChange={(event) => onQuery(event.target.value)}
                placeholder="Search by name or city"
            />
            <label>
                <input
                    type="checkbox"
                    checked={onlyCheap}
                    onChange={(event) => onOnlyCheap(event.target.checked)}
                />
                Under 100
            </label>
        </div>
    );
}

// ---------------------------------------------------------------
// 3. The parent. State, one derived list, two stable handlers.
// ---------------------------------------------------------------
export default function RoomBrowser() {
    const [query, setQuery] = useState("");
    const [onlyCheap, setOnlyCheap] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    // Derived, never stored. useMemo skips the filter and the sort
    // when the query and the checkbox stay the same, which matters
    // when the list grows or when a row select re-renders the parent.
    const visible = useMemo(() => {
        const needle = query.trim().toLowerCase();
        const cheap = onlyCheap ? rooms.filter((room) => room.price < 100) : rooms;

        if (!needle) return cheap;

        return cheap.filter(
            (room) =>
                room.name.toLowerCase().includes(needle) ||
                room.city.toLowerCase().includes(needle)
        );
    }, [query, onlyCheap]);

    // Stable, so RoomRow's memo comparison can succeed
    const selectRoom = useCallback((id) => setSelectedId(id), []);

    // The updater form means this callback does not close over
    // "query" and can stay stable with an empty array.
    const clearQuery = useCallback(() => setQuery(""), []);

    const total = useMemo(
        () => visible.reduce((sum, room) => sum + room.price, 0),
        [visible]
    );

    return (
        <section>
            <h1>Rooms</h1>

            <Toolbar
                query={query}
                onQuery={setQuery}
                onlyCheap={onlyCheap}
                onOnlyCheap={setOnlyCheap}
            />

            <p>
                {visible.length} rooms, {total} total
                <button onClick={clearQuery}>Clear search</button>
            </p>

            {visible.length === 0 ? (
                <p>Nothing matches "{query}".</p>
            ) : (
                <ul>
                    {visible.map((room) => (
                        <li key={room.id}>
                            <RoomRow
                                room={room}
                                selected={room.id === selectedId}
                                onSelect={selectRoom}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
```

Read the console while clicking. Selecting a row re-renders the parent, changes
`selectedId`, and logs only the new row and the previously selected row. Typing
logs no row at all: `room` is the same object reference from the module array,
`selectRoom` never changes, and `selected` is unchanged, so every memo comparison
passes and the rows stay still while the list around them rebuilds. Mapping the
data into new objects on each render would break that, which is the trade-off to
know: keep the references stable and `memo` has something to compare.

The nested `li` around `RoomRow` is there on purpose. `RoomRow` is memoized, not the
`li`; if the markup lived inside the row component, the memo would cover it.

## Common mistakes

- Wrapping every function in `useCallback` and every value in `useMemo`. The checks
  cost something, the code gets harder to read, and nothing is faster.
- Memoizing a child but passing an inline object, array, or arrow from the parent.
  The comparison fails every time and the memo is dead weight.
- Using the array index as a key while also memoizing rows. The row data changes
  under the same key, so the memo compares props from different records.
- Adding a dependency that is recreated each render, which makes the memo recompute
  every time.
- Leaving a dependency out to "fix" a loop. That is a stale closure, and the bug
  appears only after the first change.
- Writing `useMemo(async () => ...)`. It returns a promise, not data, and the
  calculation belongs in an effect or in the loader.
- Mutating an array inside `useMemo` and also using it elsewhere. Sort a copy.
- Expecting `memo` to block context updates. A consumer re-renders when its context
  value changes, memo or not.
- Putting `useMemo` around JSX that is cheap. Building elements is not the expensive
  part; the render of a heavy child is.
- Treating `useMemo` as a cache with a guarantee. React may drop the value, so the
  function must be safe to run again.

## Exam checklist

- Can you state what `memo`, `useMemo`, and `useCallback` each compare, and with
  which equality?
- Can you show a memoized child that still re-renders, and name the prop that breaks
  it?
- Do you know that `useCallback(fn, deps)` is `useMemo(() => fn, deps)`?
- Can you write a dependency array for a memo that reads a prop, a state value, and a
  function from the same component?
- Can you explain a stale closure in one sentence and give two fixes?
- Do you know when an empty dependency array is correct and when it is a bug?
- Can you name three cases where memoization does not help and the real fix is
  elsewhere?
- Can you keep a handler stable with the updater form instead of a dependency?
- Does your example still work if the memo wrapper is removed, apart from speed?

