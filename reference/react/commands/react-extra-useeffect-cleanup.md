# useEffect cleanup

React command · Hooks

The function returned from an effect runs before the next run and on unmount. It cancels timers, subscriptions, and stale requests.

## Syntax

```jsx
useEffect(() => { ...; return () => { ... }; }, deps)
```

## Example

```jsx
import { useEffect, useState } from "react";

function Clock({ city }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    // Without this return the interval keeps running after unmount
    return () => clearInterval(id);
  }, [city]); // a new city re-runs the effect and cleans the old timer first

  return <p>{city}: {time}</p>;
}
```
