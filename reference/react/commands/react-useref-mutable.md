# mutable instance value

React command · Refs

Keeps a value for the life of the component without causing renders. Use it for flags, request ids, and animation handles.

## Syntax

```jsx
const flagRef = useRef(false);
```

## Example

```jsx
import { useRef } from "react";

function SaveButton({ onSave }) {
  // Data shape: false, or true once a save has started.
  const savingRef = useRef(false);

  async function handleClick() {
    if (savingRef.current) return; // ignore a second click
    savingRef.current = true;

    try {
      await onSave();
    } finally {
      // Always release the flag, even when the request fails.
      savingRef.current = false;
    }
  }

  return <button onClick={handleClick}>Save</button>;
}
```
