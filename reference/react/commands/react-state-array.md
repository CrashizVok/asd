# state with an array

React command · State

Do not mutate state arrays. Create a new array with spread, filter, or map.

## Syntax

```jsx
setItems([...items, newItem])
```

## Example

```jsx
const [items, setItems] = useState([]);

function add(name) {
  setItems((old) => [...old, { id: crypto.randomUUID(), name }]);
}

function remove(id) {
  setItems((old) => old.filter((item) => item.id !== id));
}
```
