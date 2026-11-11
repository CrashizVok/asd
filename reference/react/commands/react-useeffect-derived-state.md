# derived value, no effect

React command · Effects

A value computed from props or state is calculated during render. Copying it into state with an effect costs a render and lags one step behind.

## Syntax

```jsx
const total = items.reduce(...)
```

## Example

```jsx
// Wrong: an extra state and an extra render, and the copy is one step behind.
const [total, setTotal] = useState(0);
useEffect(() => {
  setTotal(items.reduce((sum, item) => sum + item.price, 0));
}, [items]);

// Right: plain calculation during render.
const total = items.reduce((sum, item) => sum + item.price, 0);

// Also right: skip the recalculation when items did not change.
const total = useMemo(
  () => items.reduce((sum, item) => sum + item.price, 0),
  [items]
);
```

## Details

The first version renders once with the old total, then again with the new one. On a slow machine that flicker is visible. It also creates a second source of truth, and the exam question about "why does the total not update" is usually this pattern.

The same rule covers filtering, sorting, counting, formatting a date, and building a query string.

One case that does need state: a value the user can edit which starts from a prop. Keep the prop as the source and store only the edit:

```jsx
const [draft, setDraft] = useState(null);
const value = draft ?? customer.first_name;
```

`useMemo` is for an expensive calculation, not for correctness. A cheap `reduce` over fifty rows does not need it.
