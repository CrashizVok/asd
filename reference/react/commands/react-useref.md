# useRef

React command · Hooks

Holds a value between renders without causing a re-render. Use it for DOM nodes, timers, or the previous value.

## Syntax

```jsx
const ref = useRef(null);
```

## Example

```jsx
import { useRef } from "react";

function SearchBox() {
  const inputRef = useRef(null);

  return (
    <>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
    </>
  );
}
```
