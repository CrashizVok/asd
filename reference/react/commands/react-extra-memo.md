# React.memo

React command · Performance

Skips a re-render when props are shallowly equal. It helps only when the parent renders often and the props are stable.

## Syntax

```jsx
const Row = memo(Component, areEqual?)
```

## Example

```jsx
import { memo } from "react";

const HotelRow = memo(function HotelRow({ hotel }) {
  console.log("render", hotel.name);
  return <li>{hotel.name} ({hotel.stars} stars)</li>;
});

// A custom comparator gets prev and next props
const Expensive = memo(
  function Expensive({ hotel }) {
    return <p>{hotel.name}</p>;
  },
  (prev, next) => prev.hotel.hotel_id === next.hotel.hotel_id
);

export default function List({ hotels, tick }) {
  // tick changes on every parent render, but hotel objects do not
  return <ul>{hotels.map((hotel) => <HotelRow key={hotel.hotel_id} hotel={hotel} />)}</ul>;
}
```
