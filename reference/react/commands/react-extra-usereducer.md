# useReducer

React command · Hooks

Moves state transitions into one pure function. It pays off when several fields change together or the next state depends on the previous one.

## Syntax

```jsx
const [state, dispatch] = useReducer(reducer, initialState)
```

## Example

```jsx
import { useReducer } from "react";

const initial = { adults: 2, children: 0, breakfast: false };

function reducer(state, action) {
  switch (action.type) {
    case "adults":
      // Never go below one adult
      return { ...state, adults: Math.max(1, state.adults + action.delta) };
    case "children":
      return { ...state, children: Math.max(0, state.children + action.delta) };
    case "breakfast":
      return { ...state, breakfast: action.value };
    case "reset":
      return initial;
    default:
      throw new Error("Unknown action: " + action.type);
  }
}

export default function BookingForm() {
  const [state, dispatch] = useReducer(reducer, initial);

  return (
    <form>
      <p>Adults: {state.adults}</p>
      <button type="button" onClick={() => dispatch({ type: "adults", delta: 1 })}>
        Add adult
      </button>
      <button type="button" onClick={() => dispatch({ type: "reset" })}>
        Reset
      </button>
    </form>
  );
}
```

## Details

## Why a reducer

With `useState` every rule about the next value lives in an event handler. A reducer collects those rules in one function that can be read and tested on its own.

## The rules

- The reducer must be pure. Return a new object, never mutate `state`.
- Every action goes through `dispatch`, so logging one place shows all changes.
- An unknown action should throw in development, not silently return the old state.
- `useReducer` is not only for large state. Three related fields are enough.
