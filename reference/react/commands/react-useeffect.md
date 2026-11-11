# useEffect()

React command · Effects

Runs the callback after React commits the render. Use it for work outside React: network, timers, listeners, the document. Return a cleanup function for anything the callback started.

## Syntax

```jsx
useEffect(callback, [deps])
```

## Example

```jsx
import { useEffect, useState } from "react";

// Data shape: count: number
export default function Counter() {
  const [count, setCount] = useState(0);

  // Runs after the first render and after every render where count changed.
  useEffect(() => {
    document.title = `Clicked ${count} times`;
    // No cleanup: this effect starts nothing.
  }, [count]);

  return (
    <button onClick={() => setCount((value) => value + 1)}>
      Clicked {count} times
    </button>
  );
}
```

## Details

The hook needs two things to be correct: a callback that only touches the outside world, and an array listing every value the callback reads from the component.

### The three array shapes

```jsx
useEffect(() => { /* once after mount */ }, []);
useEffect(() => { /* mount and when id changes */ }, [id]);
useEffect(() => { /* after every render, usually a bug */ });
```

React compares dependency values with `Object.is`. Objects, arrays and functions declared during render are new references on every render, so they make the effect run every time. Move them out of the component, wrap them in `useMemo` or `useCallback`, or declare the function inside the effect.

If a value can be computed during render, compute it there. An effect that copies a prop into state is one render behind and doubles the work.
