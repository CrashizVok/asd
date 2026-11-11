# race condition guard

React command · Effects

Keeps an older response from overwriting a newer one when the user changes the input faster than the network answers.

## Syntax

```jsx
let ignore = false; ... if (ignore) return; return () => { ignore = true; };
```

## Example

```jsx
// Data shape: results = [{ hotel_id, name }]
useEffect(() => {
  let ignore = false; // one flag per run, closed over by the handlers

  fetch(`/api/search?word=${encodeURIComponent(word)}`)
    .then((response) => response.json())
    .then((data) => {
      if (!ignore) setResults(data);
    });

  return () => {
    ignore = true; // this run was replaced, drop its response
  };
}, [word]);
```

## Details

Type `bu`, the request for `bu` is slow. Type `bud`, the request for `bud` answers first and fills the list. Then `bu` answers and overwrites it. The input says `bud` and the list shows hotels from `bu`.

The flag fixes the order, the controller fixes the wasted bandwidth. Use both when the payload is large, the flag alone when you only care about correctness.

```jsx
useEffect(() => {
  const controller = new AbortController();

  async function load() {
    const response = await fetch(url, { signal: controller.signal });
    const data = await response.json();
    setRows(data); // unreachable for an aborted run
  }

  load().catch(() => {});
  return () => controller.abort();
}, [url]);
```

A guard without a cleanup is not a guard. The flag has to be flipped by the cleanup, because that is the only place React tells you the run is over.
