# stopPropagation

JavaScript command · Events

Stops the event from bubbling to parent elements. Use it when a child click should not trigger the parent card click.

## Syntax

```js
event.stopPropagation()
```

## Example

```js
const ownerButton = document.querySelector(".owner-button");

ownerButton.addEventListener("click", (event) => {
  event.stopPropagation();
  openOwner();
});
```
