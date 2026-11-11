# createPortal

React command · Components

Renders children into another DOM node while keeping React context and event bubbling. It is how modals escape overflow and z-index traps.

## Syntax

```jsx
createPortal(children, container)
```

## Example

```jsx
import { useState } from "react";
import { createPortal } from "react-dom";

function Modal({ open, onClose, children }) {
  if (!open) return null;

  // The markup lands in body, outside the parent stacking context
  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}

export default function App() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Book</button>
      <Modal open={open} onClose={() => setOpen(false)}>Booking form</Modal>
    </>
  );
}
```
