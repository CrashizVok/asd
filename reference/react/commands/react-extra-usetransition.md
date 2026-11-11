# useTransition

React command · Hooks

Marks a state update as non urgent, so typing stays responsive while a heavy list re-renders.

## Syntax

```jsx
const [isPending, startTransition] = useTransition()
```

## Example

```jsx
import { useState, useTransition } from "react";

function HotelSearch({ hotels }) {
  const [query, setQuery] = useState("");
  const [list, setList] = useState(hotels);
  const [isPending, startTransition] = useTransition();

  function handleChange(event) {
    const next = event.target.value;
    setQuery(next); // urgent, must follow the keystroke

    startTransition(() => {
      // Non urgent, React may interrupt this render
      setList(hotels.filter((hotel) => hotel.name.includes(next)));
    });
  }

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <p>Filtering...</p>}
      <ul>{list.map((hotel) => <li key={hotel.hotel_id}>{hotel.name}</li>)}</ul>
    </div>
  );
}
```
