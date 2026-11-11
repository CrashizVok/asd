# async work inside an effect

React command · Effects

The effect callback must not be async. An async function returns a Promise, and React expects nothing or a cleanup function.

## Syntax

```jsx
useEffect(() => { async function load() {} load(); }, [deps])
```

## Example

```jsx
// Wrong: the callback returns a Promise, so React never gets a cleanup.
useEffect(async () => {
  const data = await getHotels();
  setHotels(data);
}, []);

// Right: an inner async function, called and not awaited.
useEffect(() => {
  async function load() {
    const data = await getHotels();
    setHotels(data);
  }

  load();
  return () => { /* cleanup stays reachable */ };
}, []);
```

## Details

The inner function also gives you a natural place for `try` and `catch`. An unhandled rejection in the effect body becomes a console error and a spinner that never stops.

If the effect needs to wait for its own cleanup, that is a sign the state should live in a parent or in a store. The effect model expects fire and forget plus a cleanup.

Do not `await` the inner call either. Awaiting would make the callback async again and delay the cleanup until the request finished, which may be after unmount.
