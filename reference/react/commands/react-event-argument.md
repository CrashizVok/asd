# passing an argument

React command · Events

Wrap the call in an arrow function when the handler needs an argument. Otherwise it runs during render.

## Syntax

```jsx
onClick={() => remove(id)}
```

## Example

```jsx
function List({ items, onRemove }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.name}
          <button onClick={() => onRemove(item.id)}>Remove</button>
        </li>
      ))}
    </ul>
  );
}
```
