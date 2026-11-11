# useDeferredValue

React command · Hooks

Returns a lagging copy of a value. The UI keeps the old copy while the expensive part renders the new one.

## Syntax

```jsx
const deferred = useDeferredValue(value)
```

## Example

```jsx
import { useDeferredValue, useState } from "react";

function SlowList({ text }) {
  // Imagine a thousand rows here
  return <p>Rendering {text}</p>;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  // The input updates immediately, the list follows when React is free
  const stale = query !== deferredQuery;

  return (
    <div>
      <input value={query} onChange={(event) => setQuery(event.target.value)} />
      <div style={{ opacity: stale ? 0.5 : 1 }}>
        <SlowList text={deferredQuery} />
      </div>
    </div>
  );
}
```
