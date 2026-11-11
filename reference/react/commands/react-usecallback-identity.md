# useCallback

React command · Memoization

Returns the same function object while the dependencies are equal. Needed for memoized children and dependency arrays.

## Syntax

```jsx
const fn = useCallback((arg) => body, [deps]);
```

## Example

```jsx
const selectRoom = useCallback((id) => setSelectedId(id), []);

// Now this child can skip renders
const Row = memo(function Row({ room, onSelect }) {
    return <li onClick={() => onSelect(room.id)}>{room.name}</li>;
});
```

## Details

`useCallback(fn, deps)` is `useMemo(() => fn, deps)`. It does not make the function faster and it is pointless for a handler used only on a DOM element.

```jsx
// No benefit here, nobody compares this function
<button onClick={() => setOpen(true)}>Open</button>
```
