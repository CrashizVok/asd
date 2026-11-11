# useRef

React command · Refs

Returns a stable object with one mutable field, current. Writing current does not re-render, so it fits DOM nodes and values that must survive renders.

## Syntax

```jsx
const ref = useRef(initialValue);
```

## Example

```jsx
import { useRef } from "react";

function SearchBox() {
  // Data shape: { current: null } until the input is committed.
  const inputRef = useRef(null);

  return (
    <>
      <input ref={inputRef} placeholder="Search hotels" />
      <button onClick={() => inputRef.current?.focus()}>
        Focus the field
      </button>
    </>
  );
}
```

## Details

The same object comes back on every render. React fills `current` with the DOM node after the commit and clears it to `null` when the node leaves the page.

Do not read `ref.current` during render. Use an effect, a callback ref, or an event handler.
