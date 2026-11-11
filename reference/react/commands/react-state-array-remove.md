# remove from state array

React command · State updates

Builds a new array without the item instead of mutating the old one.

## Syntax

```jsx
setItems(items => items.filter(item => item.id !== id))
```

## Example

```jsx
// Data shape: [{ id, name }]
const [items, setItems] = useState([
  { id: 1, name: 'Coffee' },
  { id: 2, name: 'Tea' },
]);

function removeItem(id) {
  // filter returns a new array, so React sees a new reference.
  setItems(current => current.filter(item => item.id !== id));
}

// Adding is a spread:
// setItems(current => [...current, { id: 3, name: 'Water' }]);
```

## Details

`splice` and `push` mutate the array React already holds. The reference stays the same, the render is skipped, and the old render's data changes under it.

Use `filter` to remove, `map` to replace one item, spread to add. `sort` and `reverse` also mutate, so copy first: `setItems([...items].sort(byName))`.
