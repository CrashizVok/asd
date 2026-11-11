# update one state array item

React command · State updates

Replaces a single object inside an array while leaving the other items untouched.

## Syntax

```jsx
setItems(items => items.map(i => i.id === id ? { ...i, done: !i.done } : i))
```

## Example

```jsx
// Data shape: [{ id, name, done }]
function toggleTask(id) {
  setTasks(current =>
    current.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    )
  );
}

// The same pattern with a computed value from the row:
// setTasks(current => current.map(t => t.id === id ? { ...t, name } : t));
```

## Details

The unchanged rows keep their identity, which helps memoized children skip work. Return the original object for every row that is not the target, never a fresh copy of it.

If the array is large and updates are frequent, index the rows by id in a `Map` outside the render, or move the collection into `useReducer` so the update rule lives in one place.
