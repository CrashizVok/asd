# useRef mistakes

React command · Pitfalls

The recurring errors: reading during render, using a ref for displayed data, missing null checks, and leaving stale timer ids.

## Syntax

```jsx
// read refs in effects, handlers, or callback refs
```

## Example

```jsx
import { useCallback, useEffect, useRef, useState } from "react";

function SafePattern({ open }) {
  const panelRef = useRef(null);
  const [width, setWidth] = useState(0);

  // Read the node after commit, never during render.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return; // the node may not exist yet
    setWidth(panel.offsetWidth);
  }, [open]);

  // Callback ref with a stable identity and a block body.
  const measure = useCallback((node) => {
    if (node) setWidth(node.offsetWidth);
  }, []);

  return (
    <section>
      {open && <div ref={panelRef}>{width} px</div>}
      <div ref={measure} className="probe" />
    </section>
  );
}
```

## Details

Checklist against the usual failures:

- Use state when the value is drawn. A ref that the JSX reads looks one render stale.
- Guard `ref.current` at the point of use, especially after `await`.
- Reset timer and frame ids after clearing.
- Never call `useRef` inside a condition or a loop.
- Do not put side effects in the initializer; StrictMode runs it twice.
- Do not pass a ref to a function component that neither forwards nor accepts it.
- Do not return an assignment from a callback ref on React 19.
