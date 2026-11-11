# ref on a DOM element

React command · Refs

Attaches a host element to a ref. React sets current after commit and resets it to null on unmount.

## Syntax

```jsx
<input ref={inputRef} />
```

## Example

```jsx
import { useEffect, useRef } from "react";

function AutoFocusField() {
  const fieldRef = useRef(null);

  useEffect(() => {
    // The effect runs after the input exists, so the node is not null here.
    const field = fieldRef.current;
    if (!field) return;

    field.focus();
    field.select();
  }, []);

  return <input ref={fieldRef} defaultValue="Budapest" />;
}
```
