# addEventListener

JavaScript command · Events

Runs a function when an event happens. Use named functions when you need to remove the listener later.

## Syntax

```js
element.addEventListener("click", handler)
```

## Example

```js
const button = document.querySelector("button");

button.addEventListener("click", () => {
  console.log("clicked");
});
```
