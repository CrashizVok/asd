---
id: react-usereducer
lang: React
title: useReducer
override: true
---

# useReducer

## Simplest form

```jsx
// Data shape: [state, dispatch], where state is whatever the reducer returns
// and dispatch takes an action object { type, ...payload }
const [state, dispatch] = useReducer(reducer, { count: 0 });
```

The reducer is a plain function `(state, action) => nextState`. You never call it yourself. React calls it when you send an action with `dispatch`.

```jsx
// Data shape: action { type: "add", amount: number }
function reducer(state, action) {
    switch (action.type) {
        case "add":
            return { count: state.count + action.amount };
        case "reset":
            return { count: 0 };
        default:
            throw new Error(`Unknown action: ${action.type}`);
    }
}
```

## What it does

`useReducer` is `useState` with the update logic moved out of the component into a named function. The component sends a description of what happened, the reducer decides what the next state is. That split is the whole idea.

With `useState` a click handler usually carries the logic: read the current value, compute, call the setter. With `useReducer` the handler only says `dispatch({ type: "line/removed", id })`. The rules for how state changes live in one function that you can read, test and reuse.

The cost is more code up front. The gain is that every transition has a name, and a component with many fields stops looking like a pile of setters.

## Every part

### The reducer

A pure function of two arguments. Given the same state and action it returns the same result, and it touches nothing outside itself. No fetch, no `localStorage`, no `Math.random()`, no `Date.now()`, no `dispatch`. Those belong in the event handler or an effect.

React may call the reducer twice in development Strict Mode to warn you about impurity. A reducer that mutates its argument will produce wrong state under that check.

```jsx
function reducer(state, action) {
    switch (action.type) {
        case "added":
            // New array, new object, old state untouched.
            return { ...state, items: [...state.items, action.item] };
        default:
            return state;
    }
}
```

Returning the same state object is allowed and means "nothing changed". React then skips the render.

### The state

One value, often an object or an array. Since the reducer owns every change, the state shape can be as wide as the screen needs:

```jsx
// Data shape:
// { status: "idle" | "saving" | "error", errors: {}, values: {...} }
const initialState = { status: "idle", errors: {}, values: {} };
```

All fields still need to be replaced, not mutated, when they change. The state is as read-only here as it is with `useState`.

### The action

An object that describes what happened in the past tense. `type` is required and is the switch key. Everything else is payload the reducer needs.

```jsx
dispatch({ type: "qty/changed", hotel_id: 4, qty: 2 });
dispatch({ type: "form/reset" });
```

Two habits keep actions readable. First, use string constants or a namespaced string like `"cart/line-added"` so a typo fails loudly instead of silently doing nothing. Second, put only the data the reducer needs in the payload, not the whole component state.

### The dispatch function

`dispatch(action)` asks React to run the reducer with the current state and the action, then render with the result. Like a setter, it does not change `state` inside the running handler.

React guarantees `dispatch` is the same function on every render. That means you can leave it out of dependency arrays, and passing it to a child does not break `React.memo`.

Dispatching during render is wrong. It schedules another render while the current one is still running, and React will warn or loop. Dispatch from handlers, effects and callbacks.

### The initializer, third argument

The third argument is an init function that receives the second argument and returns the real initial state. Use it when the initial state must be computed or read from storage:

```jsx
// Data shape: draft { customer_email: string, adults: number }
function init(savedDraft) {
    return savedDraft ?? { customer_email: "", adults: 2 };
}

const [draft, dispatch] = useReducer(reducer, readDraft(), init);
```

`readDraft()` runs on every render, but React passes its result to `init` only on mount. The point is the same as `useState(() => value)`: do the expensive work once. If the value is cheap, skip the third argument.

Some teams skip `init` and use a `"reset"` action instead, because reset must work later anyway. Both are fine. Doing both, a lazy init and a reset action, is common.

## When it beats useState

Reach for `useReducer` when one of these is true.

Several fields change together and the combinations are hard to keep straight. A form with values, errors and a status is the standard case.

The next state depends on the previous one in more than an increment. Undo history, a queue, a state machine with legal transitions.

The update rules should be testable without rendering. A pure reducer is easy to call in a test file.

A child deep in the tree needs to trigger a change without receiving five callbacks. Pass `dispatch` down once, or through context, and the child names the action it wants.

Stay with `useState` for a toggle, a text field, a counter, or a value that one handler sets directly. Wrapping a boolean in a reducer adds ceremony and buys nothing.

## Designing actions

Treat `type` values as an enum. Write them once and reuse:

```jsx
const ACTIONS = {
    ADD: "cart/add",
    REMOVE: "cart/remove",
    QTY: "cart/qty",
    CLEAR: "cart/clear",
};

dispatch({ type: ACTIONS.QTY, hotel_id: 1, qty: 3 });
```

Handle the unknown case explicitly. A `default` that returns `state` is safe but hides typos. A `default` that throws turns a typo into a visible error in development, which is what you want while building. Pick one and be consistent. Never let `default` fall through without a return, or the reducer produces `undefined` and the next render crashes on `state.something`.

Prefer many small actions over one `"update"` action with a field name:

```jsx
dispatch({ type: "field/changed", field: "city", value: "Eger" });
```

That works, but the reducer now has to trust any field name, and the allowed transitions are invisible. A handful of explicit actions documents the legal moves.

## Examples

### Example 1: counter with undo

```jsx
import { useReducer } from "react";

// Data shape: { past: number[], present: number }
const initialState = { past: [], present: 0 };

function reducer(state, action) {
    switch (action.type) {
        case "increment":
            // Push the old value so undo can return to it.
            return { past: [...state.past, state.present], present: state.present + 1 };
        case "decrement":
            return { past: [...state.past, state.present], present: state.present - 1 };
        case "undo": {
            if (state.past.length === 0) return state;
            const previous = state.past[state.past.length - 1];
            return { past: state.past.slice(0, -1), present: previous };
        }
        case "reset":
            return initialState;
        default:
            throw new Error(`Unknown action: ${action.type}`);
    }
}

function UndoCounter() {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <div>
            <p>{state.present}</p>
            <button onClick={() => dispatch({ type: "increment" })}>+</button>
            <button onClick={() => dispatch({ type: "decrement" })}>-</button>
            <button onClick={() => dispatch({ type: "undo" })} disabled={!state.past.length}>
                Undo
            </button>
            <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
        </div>
    );
}

export default UndoCounter;
```

The reducer holds the history rule. The component has no idea how undo works, it only sends the action.

### Example 2: task list with a filter

```jsx
import { useReducer, useState } from "react";

// Data shape:
// { tasks: [{ id, name, done }], filter: "all" | "open" | "done" }
const initialState = {
    tasks: [
        { id: 1, name: "Write the reducer", done: true },
        { id: 2, name: "Test the reducer", done: false },
    ],
    filter: "all",
};

function reducer(state, action) {
    switch (action.type) {
        case "task/added":
            return {
                ...state,
                tasks: [...state.tasks, { id: action.id, name: action.name, done: false }],
            };
        case "task/toggled":
            return {
                ...state,
                tasks: state.tasks.map((task) =>
                    task.id === action.id ? { ...task, done: !task.done } : task
                ),
            };
        case "task/removed":
            return {
                ...state,
                tasks: state.tasks.filter((task) => task.id !== action.id),
            };
        case "filter/changed":
            return { ...state, filter: action.filter };
        default:
            throw new Error(`Unknown action: ${action.type}`);
    }
}

function TaskBoard() {
    const [state, dispatch] = useReducer(reducer, initialState);
    // The draft is local and short lived. It is not part of the reducer.
    const [draft, setDraft] = useState("");

    function handleSubmit(event) {
        event.preventDefault();
        const name = draft.trim();
        if (!name) return;
        dispatch({ type: "task/added", id: Date.now(), name });
        setDraft("");
    }

    const visible = state.tasks.filter((task) => {
        if (state.filter === "open") return !task.done;
        if (state.filter === "done") return task.done;
        return true;
    });

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input value={draft} onChange={(e) => setDraft(e.target.value)} />
                <button type="submit">Add</button>
            </form>

            <select
                value={state.filter}
                onChange={(e) => dispatch({ type: "filter/changed", filter: e.target.value })}
            >
                <option value="all">All</option>
                <option value="open">Open</option>
                <option value="done">Done</option>
            </select>

            <ul>
                {visible.map((task) => (
                    <li key={task.id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={task.done}
                                onChange={() => dispatch({ type: "task/toggled", id: task.id })}
                            />
                            {task.name}
                        </label>
                        <button onClick={() => dispatch({ type: "task/removed", id: task.id })}>
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TaskBoard;
```

The filter sits in the reducer because the select and the list both read it, and it changes through an action like everything else. The draft stays in `useState` because nothing else needs it and it does not survive a submit.

### Example 3: fetch status as a small state machine

```jsx
import { useEffect, useReducer } from "react";

// Data shape:
// { status: "idle" | "loading" | "success" | "error", hotels: [], error: null }
const initialState = { status: "idle", hotels: [], error: null };

function reducer(state, action) {
    switch (action.type) {
        case "requested":
            // Leaving the old list in place would show stale rows under a
            // loading label. Clear it here instead of in the component.
            return { status: "loading", hotels: [], error: null };
        case "loaded":
            return { status: "success", hotels: action.hotels, error: null };
        case "failed":
            return { status: "error", hotels: [], error: action.error };
        default:
            throw new Error(`Unknown action: ${action.type}`);
    }
}

function HotelList({ city }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        // A flag stops the older response from overwriting a newer one.
        let active = true;
        dispatch({ type: "requested" });

        fetch(`/api/hotels?city=${encodeURIComponent(city)}`)
            .then((response) => {
                if (!response.ok) throw new Error("Request failed");
                return response.json();
            })
            .then((hotels) => {
                if (active) dispatch({ type: "loaded", hotels });
            })
            .catch((error) => {
                if (active) dispatch({ type: "failed", error: error.message });
            });

        return () => {
            active = false;
        };
    }, [city]);

    if (state.status === "loading") return <p>Loading...</p>;
    if (state.status === "error") return <p role="alert">{state.error}</p>;

    return (
        <ul>
            {state.hotels.map((hotel) => (
                <li key={hotel.hotel_id}>
                    {hotel.name}, {hotel.city}, {hotel.stars} stars
                </li>
            ))}
        </ul>
    );
}

export default HotelList;
```

The illegal combinations (`status: "success"` with `error` set, or `loading` with a full list) cannot be built, because only three actions exist and each one writes a complete state.

### Example 4: a commented booking form

A realistic form with several fields, validation, a submit attempt counter and a reset. Read it top to bottom.

```jsx
import { useReducer } from "react";

// Data shape:
// {
//   values: { customer_email, first_name, last_name, phone, city, adults, children },
//   errors: { fieldName: message },
//   status: "editing" | "submitting" | "done",
//   attempts: number
// }
const initialState = {
    values: {
        customer_email: "",
        first_name: "",
        last_name: "",
        phone: "",
        city: "",
        adults: 2,
        children: 0,
    },
    errors: {},
    status: "editing",
    attempts: 0,
};

// Validation lives outside the reducer. It is a pure function, so the handler
// can call it and a test can call it without rendering anything.
function validate(values) {
    const errors = {};
    if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(values.customer_email)) {
        errors.customer_email = "Enter a valid email.";
    }
    if (!values.first_name.trim()) errors.first_name = "First name is required.";
    if (!values.last_name.trim()) errors.last_name = "Last name is required.";
    if (values.phone && !/^\d{7,15}$/.test(values.phone)) {
        errors.phone = "Digits only, 7 to 15 characters.";
    }
    if (!values.city.trim()) errors.city = "City is required.";
    if (values.adults + values.children === 0) {
        errors.adults = "At least one guest.";
    }
    return errors;
}

function reducer(state, action) {
    switch (action.type) {
        case "field/changed":
            // Errors for a field disappear as soon as the user edits it, so
            // the message does not argue with the cursor.
            return {
                ...state,
                values: { ...state.values, [action.field]: action.value },
                errors: { ...state.errors, [action.field]: undefined },
                status: "editing",
            };

        case "guest/changed": {
            // Numbers arrive from inputs as strings. Clamp to zero here so no
            // component has to repeat the guard.
            const value = Math.max(0, Number(action.value) || 0);
            return {
                ...state,
                values: { ...state.values, [action.field]: value },
                errors: { ...state.errors, adults: undefined },
            };
        }

        case "submit/checked": {
            // The handler already ran validate and passes the verdict in. The
            // reducer stores it and counts the attempt. No validation twice.
            const failed = Object.keys(action.errors).length > 0;
            return {
                ...state,
                errors: action.errors,
                attempts: state.attempts + 1,
                status: failed ? "editing" : "submitting",
            };
        }

        case "submit/succeeded":
            return { ...state, status: "done" };

        case "form/reset":
            // Returning the shared constant is safe because nothing mutates it.
            return initialState;

        default:
            throw new Error(`Unknown action: ${action.type}`);
    }
}

function BookingForm() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { values, errors, status, attempts } = state;

    function setField(field, value) {
        dispatch({ type: "field/changed", field, value });
    }

    function setGuest(field, value) {
        dispatch({ type: "guest/changed", field, value });
    }

    function handleSubmit(event) {
        event.preventDefault();
        const nextErrors = validate(values);
        dispatch({ type: "submit/checked", errors: nextErrors });

        if (Object.keys(nextErrors).length === 0) {
            // A real app would await the request here and dispatch on the
            // response. This demo saves at once. Both calls in one handler
            // produce a single render.
            dispatch({ type: "submit/succeeded" });
        }
    }

    if (status === "done") {
        return (
            <div>
                <p>
                    Booking saved for {values.last_name} {values.first_name} in {values.city}.
                </p>
                <button onClick={() => dispatch({ type: "form/reset" })}>New booking</button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <p>Attempts: {attempts}</p>

            <label>
                customer_email
                <input
                    value={values.customer_email}
                    onChange={(e) => setField("customer_email", e.target.value)}
                />
            </label>
            {errors.customer_email && <p role="alert">{errors.customer_email}</p>}

            <label>
                first_name
                <input value={values.first_name} onChange={(e) => setField("first_name", e.target.value)} />
            </label>
            {errors.first_name && <p role="alert">{errors.first_name}</p>}

            <label>
                last_name
                <input value={values.last_name} onChange={(e) => setField("last_name", e.target.value)} />
            </label>
            {errors.last_name && <p role="alert">{errors.last_name}</p>}

            <label>
                phone
                <input value={values.phone} onChange={(e) => setField("phone", e.target.value)} />
            </label>
            {errors.phone && <p role="alert">{errors.phone}</p>}

            <label>
                city
                <input value={values.city} onChange={(e) => setField("city", e.target.value)} />
            </label>
            {errors.city && <p role="alert">{errors.city}</p>}

            <label>
                adults
                <input
                    type="number"
                    min="0"
                    value={values.adults}
                    onChange={(e) => setGuest("adults", e.target.value)}
                />
            </label>

            <label>
                children
                <input
                    type="number"
                    min="0"
                    value={values.children}
                    onChange={(e) => setGuest("children", e.target.value)}
                />
            </label>
            {errors.adults && <p role="alert">{errors.adults}</p>}

            <button type="submit">Save booking</button>
        </form>
    );
}

export default BookingForm;
```

The component knows three things: which action a keystroke sends, where to show an error, and what to render per status. The rules for valid input, for clearing an error and for counting attempts sit in the reducer where they can be tested without a browser.

Two dispatches run in one submit handler, and React renders once. The first stores the verdict, the second moves a clean form to `submitting`. In a real app the second dispatch waits for the response. The demo keeps both in the handler so the whole flow stays readable.

Notice what the reducer receives. The submit action carries `errors`, so the reducer stays a pure switch and the validation function is called by the handler, which needs the answer anyway to decide whether to save.

## Common mistakes

Mutating `state` in the reducer and returning it. React compares the reference, sees no change, and skips the render. It also corrupts the previous state that React still holds.

Calling `dispatch` inside the reducer. The reducer must be pure and it already returns the next state. Triggering another action belongs in the handler or an effect.

Doing side effects in the reducer: `fetch`, `localStorage.setItem`, `console.log` of business events, `Date.now()`, `Math.random()`. Strict Mode calls the reducer twice, so the effect happens twice or the state stops being predictable.

Forgetting a `return` in one branch, or letting `default` fall through. The state becomes `undefined` and the next render throws when it reads a field. Every path needs a return.

Returning `undefined` for an unknown action instead of `state`. Same crash, harder to find. Return `state` or throw.

Reading `state` right after `dispatch`. The variable still holds the value from the current render. Compute the next value in the handler if you need it now, or react to it in an effect.

Using a reducer for a single boolean or a single string. The action constant, the reducer, the switch and the dispatch cost more than `useState` and teach the reader nothing.

Storing the same fact twice, once in the reducer state and once in `useState`, then syncing them with an effect. Pick one owner.

Putting derived values in the state. `total`, `errorCount` and `filteredList` should be computed from the state during render, not updated by every action.

Writing `useReducer(reducer(), initial)` instead of `useReducer(reducer, initial)`. Calling the reducer during render passes its return value as a reducer and crashes. Pass the function.

Recreating the reducer with different captured props and expecting the state to reset. The reducer identity is not what resets state. Change the `key` on the component instead.

Assuming `dispatch` is unstable. It is stable for the life of the component, so it does not belong in dependency arrays.

## Exam checklist

- Write the reducer signature `(state, action) => nextState` and the hook call from memory.
- Explain what `dispatch` does and that it does not change state synchronously.
- Keep the reducer pure: no mutation, no side effects, no dispatch, same input gives same output.
- Handle every action type, and decide what the default branch does.
- Design an action with a `type` and the payload the reducer needs, no more.
- Use the third argument, the initializer, for expensive or stored initial state, and explain why the second argument is passed through it.
- Choose `useReducer` over `useState` when many fields change together, transitions must be legal, or update logic needs its own tests.
- Return new objects and arrays from the reducer; returning the same state object means no render.
- Keep derived values out of state, compute them in render.
- Use a status field or a small state machine instead of several booleans that can contradict each other.
- Explain how `useReducer` plus context lets deep children dispatch without prop drilling, and why `dispatch` is safe in a dependency array.
- Read a reducer and name the legal state transitions; then read the component and find which handler sends which action. That is the usual exam exercise.
