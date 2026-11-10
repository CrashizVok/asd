# rules of hooks

React command · Patterns

Do not call hooks inside conditions, loops, or nested functions. The order must be the same on every render. Custom hooks start with use.

## Syntax

```jsx
Call hooks at the top level.
```

## Example

```jsx
function Good({ show }) {
  const [count, setCount] = useState(0);
  useEffect(() => {}, []);
  return show ? <p>{count}</p> : null;
}

// Do not do this:
// if (show) { useState(0); }
```
