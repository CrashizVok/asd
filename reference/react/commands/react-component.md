# function component

React command · Components

A component is a function that returns JSX. Its name must start with a capital letter.

## Syntax

```jsx
function Card() { return <div />; }
```

## Example

```jsx
function HotelCard({ name, stars }) {
  return (
    <article className="card">
      <h2>{name}</h2>
      <p>{stars} stars</p>
    </article>
  );
}

export default HotelCard;
```
