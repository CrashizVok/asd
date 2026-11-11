# stale closure

React command · Memoization

A function with an empty dependency array keeps reading the values from the render that created it.

## Syntax

```jsx
useEffect(() => { ... }, []); // captures the first render's values
```

## Example

```jsx
// Bug: count stays 0 inside the interval
useEffect(() => {
    const id = setInterval(() => setCount(count + 1), 1000);
    return () => clearInterval(id);
}, []);

// Fix 1: updater form
useEffect(() => {
    const id = setInterval(() => setCount((old) => old + 1), 1000);
    return () => clearInterval(id);
}, []);
```

## Details

Two other fixes. Add the value to the dependency array and let the effect restart, or keep a ref that points at the newest value when the effect must not restart.

```jsx
const countRef = useRef(count);
countRef.current = count;

useEffect(() => {
    const id = setInterval(() => setCount(countRef.current + 1), 1000);
    return () => clearInterval(id);
}, []);
```

The same trap appears in event listeners registered once, in `setTimeout`, and in debounce callbacks.
