# event handler

React command · Events

React events use camelCase: onClick, onChange, onSubmit. Pass the function, not the result of calling it.

## Syntax

```jsx
<button onClick={handleClick}>Save</button>
```

## Example

```jsx
function Form() {
  function handleSubmit(event) {
    event.preventDefault();
    console.log("sent");
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Save</button>
    </form>
  );
}
```
