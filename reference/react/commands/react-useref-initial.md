# initial value

React command · Refs

The argument is evaluated on every render but only the first result is kept. A function argument is stored, not called.

## Syntax

```jsx
useRef(initialValue)
```

## Example

```jsx
import { useRef } from "react";

function Index({ rows }) {
  // Wrong: buildIndex(rows) runs on every render, result discarded.
  // const indexRef = useRef(buildIndex(rows));

  // Right: build once, on the first render that needs the index.
  const indexRef = useRef(null);
  if (indexRef.current === null) {
    indexRef.current = buildIndex(rows);
  }

  // useRef does not call a function argument, it stores it.
  const callbackRef = useRef(() => rows.length);
  console.log(typeof callbackRef.current); // "function"

  return null;
}

function buildIndex(rows) {
  return new Map(rows.map((row) => [row.hotel_id, row]));
}
```
