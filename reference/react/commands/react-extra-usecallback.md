# useCallback

React command · Hooks

Keeps the same function identity between renders while dependencies stay equal. It matters when a memoized child receives the function.

## Syntax

```jsx
const fn = useCallback(() => { ... }, deps)
```

## Example

```jsx
import { memo, useCallback, useState } from "react";

// memo skips the render only when props are equal by reference
const Row = memo(function Row({ hotel, onSelect }) {
  return <button onClick={() => onSelect(hotel.hotel_id)}>{hotel.name}</button>;
});

export default function HotelList({ hotels }) {
  const [selected, setSelected] = useState(null);

  // A new function each render would defeat memo on every Row
  const handleSelect = useCallback((hotelId) => {
    setSelected(hotelId);
  }, []); // setState is stable, so no dependency is needed

  return (
    <div>
      <p>Selected: {selected}</p>
      {hotels.map((hotel) => (
        <Row key={hotel.hotel_id} hotel={hotel} onSelect={handleSelect} />
      ))}
    </div>
  );
}
```
