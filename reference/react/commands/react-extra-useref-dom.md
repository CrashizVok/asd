# useRef for DOM nodes

React command · Hooks

Holds a mutable reference that survives renders. Attached to an element, ref.current points at the DOM node after mount.

## Syntax

```jsx
const ref = useRef(null)
```

## Example

```jsx
import { useEffect, useRef } from "react";

function SearchBox() {
  const inputRef = useRef(null);

  useEffect(() => {
    // The node exists only after the first render
    inputRef.current.focus();
  }, []);

  function clear() {
    inputRef.current.value = "";
    inputRef.current.focus();
  }

  return (
    <div>
      <input ref={inputRef} placeholder="City" />
      <button onClick={clear}>Clear</button>
    </div>
  );
}
```
