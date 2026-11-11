# useLayoutEffect

React command · Hooks

Runs after the DOM is updated but before the browser paints. Use it to measure or reposition, never for data fetching.

## Syntax

```jsx
useLayoutEffect(() => { ... }, deps)
```

## Example

```jsx
import { useLayoutEffect, useRef, useState } from "react";

function Tooltip({ children }) {
  const boxRef = useRef(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    // Measuring here avoids a visible jump after paint
    setHeight(boxRef.current.getBoundingClientRect().height);
  }, [children]);

  return (
    <div>
      <div ref={boxRef}>{children}</div>
      <p>Tooltip height: {height}px</p>
    </div>
  );
}
```
