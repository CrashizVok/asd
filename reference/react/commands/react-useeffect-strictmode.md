# StrictMode double run

React command · Effects

In development StrictMode mounts, runs effects, runs cleanups, then runs effects again. Production runs them once. A corrected effect must survive both runs.

## Syntax

```jsx
<StrictMode>{/* app */}</StrictMode>
```

## Example

```jsx
// StrictMode: setup, cleanup, setup again. The first request is aborted,
// so only one response can set state.
useEffect(() => {
  const controller = new AbortController();

  fetch("/api/hotels", { signal: controller.signal })
    .then((response) => response.json())
    .then(setHotels)
    .catch((error) => {
      if (error.name !== "AbortError") setError("Could not load hotels.");
    });

  return () => controller.abort();
}, []);
```

## Details

Two log lines in the console during development are not a bug in your component. They are the point of StrictMode: it exposes effects that are unsafe to run twice.

Symptoms that show up under StrictMode and nowhere else:

- The list is fetched twice and the server logs two GET requests, because nothing aborts the first one.
- The counter jumps by two after one click, because the effect registered two listeners or two intervals.
- A POST creates the booking twice, because there is no idempotency key and no cleanup that cancels it.

Do not delete StrictMode from `main.jsx`. Fix the effect: abort the request, remove the listener, or guard the write with a flag that the cleanup flips. A component that survives the double run also survives fast refresh and a real remount in production.
