# effect dependencies

React command · Effects

An empty array runs once after mount. [id] runs when id changes. No array runs after every render. Include every value the effect reads.

## Syntax

```jsx
useEffect(fn, [id])
```

## Example

```jsx
useEffect(() => {
  loadBookings(id);
}, [id]);

useEffect(() => {
  const timer = setInterval(tick, 1000);
  return () => clearInterval(timer);
}, []);
```
