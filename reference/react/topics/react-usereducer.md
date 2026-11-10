# useReducer

React topic · Exam Wiki

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
