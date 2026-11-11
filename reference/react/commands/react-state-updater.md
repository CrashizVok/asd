# setState(updater)

React command · State updates

Computes the next state from the latest queued value instead of the value captured by the current render.

## Syntax

```jsx
setValue(current => nextValue)
```

## Example

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function addThree() {
    // All three updaters run in order on the same queued value.
    setCount(c => c + 1);
    setCount(c => c + 1);
    setCount(c => c + 1);
  }

  // A delayed handler would still add one to the newest value.
  function addLater() {
    setTimeout(() => setCount(c => c + 1), 1000);
  }

  return <button onClick={addThree}>{count}</button>;
}
```

## Details

The plain form `setCount(count + 1)` reads `count` from the current render. Two calls in one handler both compute the same number, so the state grows by one. The updater form receives whatever is queued when React runs it.

Use it for counters, queues, toggles inside loops, and any callback that may run after the render that created it. The function must be pure: no setters, no requests, no logging of business events. React may call it twice in development to check.
