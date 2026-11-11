# StrictMode and refs

React command · Pitfalls

In development StrictMode renders twice and remounts effects. Refs created on the discarded render are thrown away, and missing cleanups show up as doubled work.

## Syntax

```jsx
useEffect(() => { ...; return cleanup; }, [])
```

## Example

```jsx
import { useEffect, useRef, useState } from "react";

function StrictSafeTicker() {
  const idRef = useRef(null);
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    // StrictMode: mount, cleanup, mount again. The cleanup keeps this at one.
    idRef.current = setInterval(() => {
      setTicks((value) => value + 1);
    }, 1000);

    return () => {
      clearInterval(idRef.current);
      idRef.current = null;
    };
  }, []);

  return <p>{ticks} ticks</p>;
}
```

## Details

Do not remove StrictMode to hide a doubled interval or a double fetch. The missing cleanup is the bug, and it will surface in production when a route change remounts the component.

An initializer with a side effect also runs twice. Keep ref initializers pure, or use the lazy `current === null` pattern for expensive pure values.
