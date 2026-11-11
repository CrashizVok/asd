# ref cleanup

React command · Refs

Cleans up timers, frames, listeners, and observers created around a ref. React clears DOM refs itself, but not the work you started.

## Syntax

```jsx
return () => { ref.current = null; };
```

## Example

```jsx
import { useEffect, useRef } from "react";

function FadeInBox() {
  const boxRef = useRef(null);
  // Data shape: 0 when no frame is pending, otherwise the frame id.
  const frameRef = useRef(0);
  const startRef = useRef(0);

  useEffect(() => {
    startRef.current = performance.now();

    const tick = (now) => {
      // Read the node again; it may have left the page since the last frame.
      const box = boxRef.current;
      if (!box) return;

      const progress = Math.min((now - startRef.current) / 1000, 1);
      box.style.opacity = String(progress); // style changes are safe
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      // Stop the loop and clear the stored id.
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    };
  }, []);

  return <div ref={boxRef} style={{ opacity: 0 }}>Fading in</div>;
}
```

## Details

The cleanup must be safe to run twice, because StrictMode runs it during the extra mount cycle and the browser runs it on real unmount.

Clear the id and set the ref back to `null` or `0`. Leaving a stale id behind makes a second cleanup clear a handle that may already belong to another effect.
