# manual reload of an effect

React command · Effects

An effect runs when a dependency changes. To run it on demand, add a counter state and bump it from a Retry handler.

## Syntax

```jsx
const [reload, setReload] = useState(0); useEffect(..., [reload])
```

## Example

```jsx
const [reload, setReload] = useState(0);

useEffect(() => {
  const controller = new AbortController();
  load(reload, controller.signal).catch(() => {});
  return () => controller.abort();
}, [reload]);

return <button onClick={() => setReload((n) => n + 1)}>Retry</button>;
```

## Details

Calling the loader directly from the click handler is also valid and often simpler, because a retry is a user action, not a state change. Use the counter when the loader needs the same setup, cleanup and guards as the automatic run, and duplicating it in the handler would mean two copies of the abort logic.

The functional increment `setReload((n) => n + 1)` is required. `setReload(reload + 1)` works only while the value is fresh, which it usually is, but the functional form has no such condition.

Do not reach for this pattern when the effect only exists because a flag changed. A handler that posts a booking is a handler, not an effect with a `submitted` dependency.
