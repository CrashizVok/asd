# useReducer

React command · Hooks

Manages complex state with actions. The reducer returns the next state and must not mutate the old one.

## Syntax

```jsx
const [state, dispatch] = useReducer(reducer, initial);
```

## Example

```jsx
function reducer(state, action) {
  switch (action.type) {
    case "inc":
      return { count: state.count + 1 };
    case "reset":
      return { count: 0 };
    default:
      return state;
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0 });
dispatch({ type: "inc" });
```
