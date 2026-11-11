# cleanup function

React command · Effects

The returned function runs before the next run of the same effect and once on unmount. Use it to stop whatever the effect started.

## Syntax

```jsx
useEffect(() => { ...; return () => { ... }; }, [deps])
```

## Example

```jsx
useEffect(() => {
  const id = setInterval(() => setTick((n) => n + 1), 1000);

  // Called before the next run and on unmount. Without it the timer keeps
  // running on a component that no longer exists.
  return () => clearInterval(id);
}, []);
```

## Details

The cleanup has to own the same resource the setup created. A timer id must be cleared, a controller aborted, a listener removed with the same function reference, a socket closed.

```jsx
useEffect(() => {
  function onResize() {
    setWidth(window.innerWidth);
  }

  window.addEventListener("resize", onResize);
  return () => window.removeEventListener("resize", onResize);
}, []);
```

The reference matters: `removeEventListener` with an anonymous arrow removes nothing. Declare the handler inside the effect and pass the same name to both calls.

Before the effect runs again, React calls the previous cleanup first. That ordering is what lets a subscription move from one room to the next without a gap: leave the old room, enter the new one.
