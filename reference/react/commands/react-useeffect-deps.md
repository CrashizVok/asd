# dependency array

React command · Effects

Lists the values the callback reads. Empty array means once, a filled array means after the first render and whenever one value changes, no array means every render.

## Syntax

```jsx
useEffect(fn, [a, b])
```

## Example

```jsx
// Run once, on mount. Correct for an initial load with no parameters.
useEffect(() => {
  loadHotels();
}, []);

// Run again when the route parameter changes.
useEffect(() => {
  loadBookings(id);
}, [id]);

// Stale closure: the effect runs once and keeps the first city it ever saw.
// The header updates, the list does not.
useEffect(() => {
  loadHotels(city);
}, []); // wrong
```

## Details

Every component value the callback reads belongs in the array. The lint rule `exhaustive-deps` exists for this and it is usually right.

A missing dependency produces a stale closure: the effect holds the values from the render that created it. The visible symptom is a list for the previous id, a total that only refreshes after a click, or a counter stuck at its first value.

An extra dependency is rarely fatal but it re-runs the effect more often than needed. A new object literal in the array is the common case:

```jsx
useEffect(() => {
  load({ page, word });
}, [{ page, word }]); // new object every render, runs every render
```

Pass the fields instead: `[page, word]`.
