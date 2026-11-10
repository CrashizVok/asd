# event object

JavaScript command · Events

The handler receives an event. target is the element that fired it. preventDefault stops the browser default action.

## Syntax

```js
event.target
event.preventDefault()
```

## Example

```js
const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  console.log(data.get("email"));
});
```
