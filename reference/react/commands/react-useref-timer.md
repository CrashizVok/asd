# timer id

React command · Timers

Stores the id from setInterval or setTimeout across renders so the same timer can be cleared. Reset it to null after clearing.

## Syntax

```jsx
const idRef = useRef(null);
```

## Example

```jsx
import { useEffect, useRef, useState } from "react";

function Ticker() {
  // Data shape: null, or the number returned by setInterval.
  const idRef = useRef(null);
  const [seconds, setSeconds] = useState(0);

  function start() {
    if (idRef.current !== null) return;

    idRef.current = setInterval(() => {
      setSeconds((value) => value + 1);
    }, 1000);
  }

  function stop() {
    if (idRef.current === null) return;

    clearInterval(idRef.current);
    idRef.current = null; // a later stop must not clear a reused id
  }

  useEffect(() => stop, []); // cleanup on unmount

  return (
    <>
      <p>{seconds} s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </>
  );
}
```

## Details

In StrictMode the effect mounts, unmounts, and mounts again in development. Without this cleanup you would see two intervals and a clock that runs twice as fast. The cleanup is required in production too, where route changes unmount the component for real.
