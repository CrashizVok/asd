# createPortal

React command · Patterns

Renders a child outside the parent DOM hierarchy. Useful for modals and tooltips that must escape overflow or z-index.

## Syntax

```jsx
createPortal(<Modal />, document.body)
```

## Example

```jsx
import { createPortal } from "react-dom";

function Modal({ children }) {
  return createPortal(
    <div className="modal-overlay">{children}</div>,
    document.body
  );
}
```
