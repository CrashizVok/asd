# lists and keys

React command · Rendering

Render lists with map. Every item needs a stable key. Use a database id, not the array index, when the list can change.

## Syntax

```jsx
items.map(item => <li key={item.id}>{item.name}</li>)
```

## Example

```jsx
function HotelList({ hotels }) {
  return (
    <ul>
      {hotels.map((hotel) => (
        <li key={hotel.id}>{hotel.name}</li>
      ))}
    </ul>
  );
}
```
