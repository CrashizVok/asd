# useMemo

React command · Memoization

Caches the result of a calculation until a dependency changes. The function must be pure.

## Syntax

```jsx
const value = useMemo(() => compute(a, b), [a, b]);
```

## Example

```jsx
const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return rooms;
    return rooms.filter((room) => room.name.toLowerCase().includes(needle));
}, [rooms, query]);
```

## Details

Worth it when the calculation grows with the data or when the result is a prop of a memoized child. Not worth it for a single arithmetic expression.

Never put a side effect inside: no `setState`, no fetch, no storage write. React may drop the cached value and run the function again.

```jsx
// Sort a copy, because sort mutates
const sorted = useMemo(() => [...rooms].sort((a, b) => a.price - b.price), [rooms]);
```
