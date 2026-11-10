# React.memo

React command · Patterns

Skips a re-render when the props are shallow equal. Use it only for components that render often.

## Syntax

```jsx
const Card = memo(function Card(props) { ... });
```

## Example

```jsx
const HotelCard = memo(function HotelCard({ hotel }) {
  return <article>{hotel.name}</article>;
});
```
