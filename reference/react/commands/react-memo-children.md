# memo and children

React command · Memoization

children is a prop. A new element on every parent render makes the memo comparison fail.

## Syntax

```jsx
<Panel><Row /></Panel>
```

## Example

```jsx
// Panel re-renders on every parent render, because the child
// element is rebuilt each time
<Panel>
    <Row room={room} />
</Panel>

// Move the state down so the parent does not re-render,
// or pass a stable element from a component that does not change
const row = useMemo(() => <Row room={room} />, [room]);
<Panel>{row}</Panel>;
```

## Details

The usual fix is structural: move the state that changes into the smallest component that needs it, so the expensive subtree is not a child of the thing that re-renders.
