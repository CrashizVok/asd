# derived value in render

React command · State patterns

Computes a value from existing state during render instead of storing and syncing it.

## Syntax

```jsx
const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)
```

## Example

```jsx
const [items, setItems] = useState([
  { id: 1, price: 90, qty: 2 },
  { id: 2, price: 120, qty: 1 },
]);

// Recalculated every render. Nothing can make it stale.
const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
const count = items.reduce((sum, item) => sum + item.qty, 0);

return <p>{count} items, {total} EUR</p>;
```

## Details

A stored copy starts correct and drifts the first time an update path forgets to refresh it. An effect that syncs the copy adds a render and a moment where the screen shows a number that does not match the list.

Wrap the calculation in `useMemo` only when it is measurably slow or when its identity is passed to a memoized child. For a filter over a few hundred rows, plain code is faster and easier to read.
