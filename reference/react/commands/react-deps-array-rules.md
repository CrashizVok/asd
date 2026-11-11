# dependency array

React command · Memoization

Compared element by element with Object.is. List every prop, state, and local function the callback reads.

## Syntax

```jsx
useMemo(fn, [a, b]); // every value read goes here
```

## Example

```jsx
// Wrong: reads query but lists nothing
const filtered = useMemo(() => rooms.filter((r) => r.city === query), []);

// Right
const filtered = useMemo(
    () => rooms.filter((r) => r.city === query),
    [rooms, query]
);
```

## Details

An empty array means compute once. A missing array means compute on every render. Module-level imports and `setState` functions from `useState` are stable and can be left out.

Do not silence the lint warning by deleting a dependency. The bug shows up later as data that stops updating.
