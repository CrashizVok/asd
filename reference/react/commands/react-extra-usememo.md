# useMemo

React command · Hooks

Caches a computed value between renders until a dependency changes. Use it for expensive work, not for every variable.

## Syntax

```jsx
const value = useMemo(() => compute(input), [input])
```

## Example

```jsx
import { useMemo, useState } from "react";

function HotelTable({ hotels }) {
  const [query, setQuery] = useState("");

  // Filtering runs only when hotels or query change, not on every keystroke elsewhere
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return hotels.filter((hotel) => hotel.name.toLowerCase().includes(needle));
  }, [hotels, query]);

  const totalStars = useMemo(
    () => visible.reduce((sum, hotel) => sum + hotel.stars, 0),
    [visible]
  );

  return (
    <div>
      <input value={query} onChange={(event) => setQuery(event.target.value)} />
      <p>{visible.length} hotels, {totalStars} stars</p>
    </div>
  );
}
```
