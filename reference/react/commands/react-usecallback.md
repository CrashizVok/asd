# useCallback

React command · Hooks

Caches a function between renders. Use it when passing callbacks to memoized children.

## Syntax

```jsx
const fn = useCallback(() => { ... }, [deps]);
```

## Example

```jsx
const handleRemove = useCallback((id) => {
  setItems((old) => old.filter((item) => item.id !== id));
}, []);
```
