---
id: react-state
lang: React
title: State and useState
override: true
---

# State and useState

## Simplest form

```jsx
// Data shape: [value, setValue]
const [count, setCount] = useState(0);
```

The hook returns a pair. The first item is the value for this render. The second item is a function that stores a new value and asks React to render the component again.

```jsx
// Data shape: [value, setValue], where value can be any JSON-like value
const [user, setUser] = useState({ first_name: "", last_name: "" });
const [tags, setTags] = useState([]);
```

## What it does

A local variable inside a component does not survive a render. React calls your function again, the `let` line runs again, and the old data is gone.

State is memory that React keeps outside your function, attached to one component instance at one position in the tree. The setter writes to that memory and schedules a render. On the next render, `useState` hands back the stored value instead of the initial one. The initial argument matters on the first render only.

Two different `<Counter />` elements on the page own two separate state cells. Remounting a component (a different `key`, a parent branch that unmounts) throws the cell away and starts from the initial value.

## Every part

### The array destructuring

`const [value, setValue] = useState(initial)` is a plain array with two entries. The names are yours. `[count, setCount]` and `[isOpen, setIsOpen]` both work because the hook returns by position, not by key.

### The initial value

Used once, on mount. Later renders pass it again but React ignores it. That is why `useState(props.something)` does not follow prop changes, a point that returns under derived state.

If building the value costs work, pass a function and React will call it once:

```jsx
// Building an index over 20 000 rows on every render would be waste.
const [index, setIndex] = useState(() => buildIndex(rows));
```

`useState(buildIndex(rows))` calls `buildIndex` on every render and throws the result away. `useState(() => buildIndex(rows))` calls it once. Keep the difference straight, exams ask for it.

### The setter and the render snapshot

`setCount` does two things: it stores the value, and it schedules a render. It does not change `count` in the function that is currently running. Within one render, `count` is a constant.

```jsx
function Counter() {
    const [count, setCount] = useState(0);

    function handleClick() {
        setCount(count + 1);
        // Still the value from this render. The new one arrives next render.
        console.log(count);
    }

    return <button onClick={handleClick}>{count}</button>;
}
```

This is not a bug, it is the snapshot model. Every render has its own props, state and event handlers, frozen at the moment React called the function.

### The same value does not always render

React compares the new value with the current one using `Object.is`. If they are equal, it may skip the render and the effects that follow. `setCount(3)` while `count` is already `3` does nothing visible. One detail students miss: `Object.is(NaN, NaN)` is `true`, so setting `NaN` twice also skips.

Equality is by reference for objects and arrays. A new `{ ...user }` is never equal to the old one, even when every field matches, so it always renders.

### One state cell per concern

Prefer separate cells for values that change independently:

```jsx
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [saving, setSaving] = useState(false);
```

Group values into one object only when they always change together, such as a filter with three fields that is applied as a unit. Separate cells keep updates smaller and avoid a spread on every keystroke.

## The updater function

Pass a function to the setter when the next value depends on the previous one:

```jsx
setCount((current) => current + 1);
```

React queues updater functions and runs them in order, each receiving the result of the previous one. Three calls in one handler add three:

```jsx
function handleTriple() {
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    // One render, count grows by 3.
}
```

With the plain form the same three lines would only add one, because all three read the same `count` from the current render.

The updater form also fixes stale closures. A handler captured in an old render still gets the latest queued value:

```jsx
function handleLater() {
    setTimeout(() => {
        // `count` here is frozen at the render that scheduled the timeout.
        // The updater reads whatever is current when React runs it.
        setCount((c) => c + 1);
    }, 2000);
}
```

The updater must be pure. It runs during rendering and may run more than once in development Strict Mode. Do not call another setter or fetch inside it.

## Objects and arrays

State values are read-only. React compares the old and the new reference, so changing a field in place is invisible:

```jsx
user.first_name = "Anna"; // wrong: same object, no render, old render mutated
setUser({ ...user, first_name: "Anna" }); // correct: new object
```

Copy the object and change the copy. The same rule covers every array operation:

```jsx
setTags([...tags, "new"]); // add
setTags(tags.filter((tag) => tag !== "new")); // remove
setTags(tags.map((tag) => (tag === "old" ? "new" : tag))); // replace one
setTags([...tags].sort()); // sort a copy, sort() mutates in place
```

For a nested change, copy each level on the path from the root to the changed field:

```jsx
// Data shape: { customer_email, address: { city, street } }
setCustomer({
    ...customer,
    address: { ...customer.address, city: "Eger" },
});
```

Two levels are easy to read. Three levels and the spreads start to hide intent, and that is one signal to move the state into `useReducer`, where each field update gets a name.

Do not deep copy everything with `JSON.parse(JSON.stringify(x))`. It drops `undefined`, turns dates into strings and costs time. Copy the path you change.

## Batching

React groups setter calls made in the same tick into one render. Since React 18 this also happens inside promises, timeouts and native event listeners, not just React event handlers.

```jsx
function handleSave() {
    setSaving(true);
    setError(null);
    setSavedAt(null);
    // One render after the handler finishes, not three.
}
```

The snapshot rule still holds inside the handler. If you need the new value right after computing it, keep it in a variable:

```jsx
const nextTotal = total + item.price;
setTotal(nextTotal);
setLog([...log, `new total ${nextTotal}`]);
```

Awaiting between setters splits the batch, because the handler has returned by then:

```jsx
async function handleSubmit() {
    setSaving(true); // renders
    await save(payload);
    setSaving(false); // renders again
}
```

That is expected. A visible saving flag needs its own render before the long request starts.

## Derived state

If a value can be computed from props and existing state, compute it during render. Do not store it, and do not mirror it with `useEffect`.

```jsx
const [items, setItems] = useState([]);
const [query, setQuery] = useState("");

// Both of these are recomputed on each render. No state, no sync bug.
const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
const visible = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
);
```

Stored copies drift. They start right, then one update path forgets to refresh them, and the screen shows an old number. Reach for `useMemo` only when the calculation is heavy or when the result identity matters for a memoized child:

```jsx
const visible = useMemo(
    () => items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())),
    [items, query]
);
```

The other trap is state that copies a prop:

```jsx
function ProfileEditor({ user }) {
    // Frozen at mount. Editing another user in the parent does not update this.
    const [draft, setDraft] = useState(user);
    // ...
}
```

When a form must start fresh for a new record, change the `key` in the parent. React unmounts the old component and mounts a new one with the new prop:

```jsx
<ProfileEditor key={user.customer_email} user={user} />
```

That gives you a clean draft with no effect and no comparison logic.

## Lifting state

Two components that must show the same value cannot each own it. Move the state to their closest common parent, pass the value down as a prop and the change handlers down as functions. The parent becomes the single source of truth.

```jsx
function SearchPage() {
    const [query, setQuery] = useState("");
    const hotels = useMemo(() => filterHotels(query), [query]);

    return (
        <>
            <SearchBox query={query} onChange={setQuery} />
            <HotelList hotels={hotels} />
        </>
    );
}

function SearchBox({ query, onChange }) {
    return (
        <input
            value={query}
            onChange={(event) => onChange(event.target.value)}
        />
    );
}
```

Children stay presentational: they receive a value and report an intention. The data flow is one direction, and debugging means reading one component instead of three.

Do not lift further than needed. A value used by one component belongs in that component. Lifting everything to the top of the app turns small updates into whole tree renders.

## Examples

### Example 1: counter with a step and a floor

```jsx
import { useState } from "react";

// Data shape: count is a number, step is a number chosen by the user
function Stepper() {
    const [count, setCount] = useState(0);
    const [step, setStep] = useState(1);

    // The updater form keeps both buttons correct even when clicks land
    // faster than renders.
    function change(direction) {
        setCount((current) => Math.max(0, current + direction * step));
    }

    return (
        <div>
            <p>Value: {count}</p>
            <label>
                Step
                <input
                    type="number"
                    min="1"
                    value={step}
                    onChange={(event) => setStep(Number(event.target.value) || 1)}
                />
            </label>
            <button onClick={() => change(-1)}>Decrease</button>
            <button onClick={() => change(1)}>Increase</button>
            <button onClick={() => setCount(0)}>Reset</button>
        </div>
    );
}

export default Stepper;
```

`Number(event.target.value) || 1` guards against an empty field, which would otherwise make `count + direction * ""` produce `NaN`.

### Example 2: object state with a nested address

```jsx
import { useState } from "react";

// Data shape:
// { customer_email: string, first_name: string, last_name: string,
//   address: { city: string, street: string } }
const emptyCustomer = {
    customer_email: "",
    first_name: "",
    last_name: "",
    address: { city: "", street: "" },
};

function CustomerCard() {
    const [customer, setCustomer] = useState(emptyCustomer);
    const [saved, setSaved] = useState(null);

    // One handler for flat fields. The computed key keeps the JSX short.
    function setField(field, value) {
        setCustomer((current) => ({ ...current, [field]: value }));
    }

    // Nested field: copy the inner object too.
    function setAddress(field, value) {
        setCustomer((current) => ({
            ...current,
            address: { ...current.address, [field]: value },
        }));
    }

    function handleSave(event) {
        event.preventDefault();
        setSaved(`${customer.last_name} ${customer.first_name}`);
        setCustomer(emptyCustomer);
    }

    return (
        <form onSubmit={handleSave}>
            <input
                value={customer.customer_email}
                onChange={(e) => setField("customer_email", e.target.value)}
                placeholder="customer_email"
            />
            <input
                value={customer.first_name}
                onChange={(e) => setField("first_name", e.target.value)}
                placeholder="first_name"
            />
            <input
                value={customer.last_name}
                onChange={(e) => setField("last_name", e.target.value)}
                placeholder="last_name"
            />
            <input
                value={customer.address.city}
                onChange={(e) => setAddress("city", e.target.value)}
                placeholder="city"
            />
            <button type="submit">Save</button>
            {saved && <p>Saved {saved}</p>}
        </form>
    );
}

export default CustomerCard;
```

Note the reset. Assigning `emptyCustomer` works because no code mutates it. If the object were edited in place, the reset would restore the edited version.

### Example 3: array state with add, toggle and remove

```jsx
import { useState } from "react";

// Data shape: [{ id: number, name: string, done: boolean }]
function TaskList() {
    const [tasks, setTasks] = useState([
        { id: 1, name: "Read the state chapter", done: false },
        { id: 2, name: "Rewrite the reducer example", done: true },
    ]);
    const [draft, setDraft] = useState("");

    function addTask(event) {
        event.preventDefault();
        const name = draft.trim();
        if (!name) return;

        setTasks((current) => [
            ...current,
            // Date.now() is fine here, the handler is not a render function.
            { id: Date.now(), name, done: false },
        ]);
        setDraft("");
    }

    function toggleTask(id) {
        setTasks((current) =>
            current.map((task) =>
                task.id === id ? { ...task, done: !task.done } : task
            )
        );
    }

    function removeTask(id) {
        setTasks((current) => current.filter((task) => task.id !== id));
    }

    const open = tasks.filter((task) => !task.done).length;

    return (
        <section>
            <form onSubmit={addTask}>
                <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="New task"
                />
                <button type="submit">Add</button>
            </form>

            <p>{open} open of {tasks.length}</p>

            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={task.done}
                                onChange={() => toggleTask(task.id)}
                            />
                            {task.name}
                        </label>
                        <button onClick={() => removeTask(task.id)}>Remove</button>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default TaskList;
```

`map` and `filter` return new arrays, so every update produces a new reference. The `key` is the stable id, not the index, because rows are removed from the middle.

### Example 4: a commented cart component

Read this one from top to bottom. It mixes object state, array state, derived values, batching and the updater form.

```jsx
import { useState } from "react";

// Data shape of one line:
// { hotel_id: number, name: string, price: number, qty: number }
//
// Cart state holds an array of lines. Order state is a flat object.
// Everything else on screen is computed during render.

const starterLines = [
    { hotel_id: 1, name: "Lake View", price: 90, qty: 1 },
    { hotel_id: 2, name: "Hill Gate", price: 120, qty: 2 },
];

function Cart() {
    // Two independent cells: lines change on every click, order changes rarely.
    const [lines, setLines] = useState(starterLines);
    const [order, setOrder] = useState({ city: "", start_date: "", adults: 2 });

    // A short lived status message. Null means nothing to show.
    const [message, setMessage] = useState(null);

    // Derived, not stored. Recalculated on each render from lines.
    const total = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
    const rooms = lines.reduce((sum, line) => sum + line.qty, 0);

    // The updater form means the event handler never reads a stale `lines`.
    function changeQty(hotel_id, delta) {
        setLines((current) =>
            current
                .map((line) =>
                    line.hotel_id === hotel_id
                        ? { ...line, qty: line.qty + delta }
                        : line
                )
                // A line at zero leaves the cart. Filtering after map keeps
                // the update in one pass and one render.
                .filter((line) => line.qty > 0)
        );
    }

    function setOrderField(field, value) {
        setOrder((current) => ({ ...current, [field]: value }));
    }

    function handleCheckout() {
        // Validation reads the snapshot from this render, which is what the
        // user sees on screen.
        if (lines.length === 0) {
            setMessage("The cart is empty.");
            return;
        }
        if (!order.city.trim() || !order.start_date) {
            setMessage("City and start date are required.");
            return;
        }

        // Three setters, one render. React batches them because they run in
        // the same event handler.
        setMessage(`Order for ${order.city} saved, ${rooms} rooms, ${total} EUR.`);
    }

    return (
        <div>
            <h2>Cart</h2>

            {lines.length === 0 ? (
                <p>No rooms selected.</p>
            ) : (
                <ul>
                    {lines.map((line) => (
                        <li key={line.hotel_id}>
                            {line.name} ({line.price} EUR)
                            <button onClick={() => changeQty(line.hotel_id, -1)}>
                                -
                            </button>
                            <span>{line.qty}</span>
                            <button onClick={() => changeQty(line.hotel_id, 1)}>
                                +
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <p>Rooms: {rooms}</p>
            <p>Total: {total} EUR</p>

            <label>
                City
                <input
                    value={order.city}
                    onChange={(event) => setOrderField("city", event.target.value)}
                />
            </label>
            <label>
                Start date
                <input
                    type="date"
                    value={order.start_date}
                    onChange={(event) =>
                        setOrderField("start_date", event.target.value)
                    }
                />
            </label>

            <button onClick={handleCheckout}>Checkout</button>

            {message && <p role="status">{message}</p>}
        </div>
    );
}

export default Cart;
```

What to notice: state holds only what the user changes; totals are computed; every update creates new objects and arrays; and all setter calls in `handleCheckout` produce a single render.

## Common mistakes

Mutating state directly: `items.push(x)` or `user.name = "x"` changes the object React already holds, so the reference does not change and no render happens.

Reading the old value right after setting it. `setCount(count + 1); console.log(count)` prints the old number. The variable belongs to the current render.

Using the plain form inside a loop or repeated handler when the value depends on the last one. `setCount(count + 1)` three times adds one. Use `setCount((c) => c + 1)`.

Storing a prop in state and expecting it to follow the prop. `useState(props.user)` copies once. Use the `key` trick or compute from the prop.

Mirroring derived values with `useEffect` plus state. It adds a render and a window where the screen shows mixed data. Compute during render, memoize only if measured slow.

Calling `setState` during render without a condition. That loops until React throws "Too many re-renders". Setters belong in handlers, effects or callbacks, never in the bare body of the component.

Passing the setter directly to a handler that expects a value: `onClick={setOpen(!open)}` runs during render and stores a boolean. Write `onClick={() => setOpen(!open)}` instead. Same trap with `onChange={setQuery}` when the argument is an event: use `onChange={(e) => setQuery(e.target.value)}`.

Forgetting that `useState` initializers are ignored after mount, then debugging why a changing prop has no effect.

Sorting or reversing the state array in place. `items.sort()` mutates and returns the same reference, so the UI does not update. Copy first.

Keeping one giant object for unrelated fields, then spreading it on every keystroke and retriggering memoized children.

## Exam checklist

- Know the tuple shape and that the initial value applies on mount only.
- Use the updater form whenever the next value depends on the previous one, including timeouts and repeated calls in one handler.
- Explain why state updates look asynchronous: each render has a frozen snapshot.
- Replace objects and arrays instead of mutating them; copy the path that changed.
- Know that a setter call with an equal value may skip the render, and that the comparison is `Object.is`.
- Explain batching: several setters in one event produce one render, and an `await` splits the batch.
- Compute derived values during render; never store them and sync with an effect.
- Reset a form when the record changes by changing `key`, not by copying props into state.
- Lift state to the closest common parent and pass values down, handlers up.
- Read a component and list which values are state, which are derived, and which are props. That answer is most of the exam task.
