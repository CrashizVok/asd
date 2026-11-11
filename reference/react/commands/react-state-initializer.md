# useState(initializer)

React command · State updates

Passes a function so the initial value is computed on mount only, not on every render.

## Syntax

```jsx
useState(() => buildInitial())
```

## Example

```jsx
// Data shape: [{ id, name }]
function buildRows() {
  // Pretend this does real work over a large array.
  return Array.from({ length: 5000 }, (_, i) => ({ id: i, name: `Row ${i}` }));
}

function Table() {
  // Wrong: buildRows() runs on every render and the result is thrown away.
  // const [rows] = useState(buildRows());

  // Right: React calls the function once, on mount.
  const [rows] = useState(() => buildRows());

  return <p>{rows.length} rows</p>;
}
```

## Details

The argument to `useState` is ignored after the first render, but an expression is still evaluated before the hook sees it. That means `useState(expensive())` pays the cost on every render for a value that is discarded.

Passing a function defers the work. `useState(() => expensive())` is called once per mounted component. If you only need the value, a function is all you keep, and the same rule applies to `useReducer`'s third argument.
