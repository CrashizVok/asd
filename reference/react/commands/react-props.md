# props

React command · Components

Props pass data from a parent to a child. They are read-only. Destructure them for shorter code.

## Syntax

```jsx
<Card name="Danube View" stars={4} />
```

## Example

```jsx
function Card({ name, stars = 3, children }) {
  return (
    <article>
      <h2>{name}</h2>
      <p>{stars} stars</p>
      {children}
    </article>
  );
}

<Card name="Danube View" stars={4}>Extra text</Card>
```
