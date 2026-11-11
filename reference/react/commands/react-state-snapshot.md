# state snapshot

React command · State updates

Each render gets its own fixed state and props; a setter affects the next render, not the running one.

## Syntax

```jsx
const [value, setValue] = useState(initial)
```

## Example

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    // Still the old number, because this render owns a fixed `count`.
    console.log(count);
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

## Details

Treat every render as a photograph: props, state and the handlers created in it hold that moment. The next render is a new photograph with new values.

This explains two common questions. Why does a timer log an old value? Because the callback was created in an old render. Why does reading state right after a setter show the old value? Because the setter schedules a render instead of editing the current one.
