# event delegation with closest

JavaScript command · Event flow

One listener on a stable parent handles current rows and rows created later. closest walks up from the real click target to the matching element.

## Syntax

```js
parent.addEventListener("click", (e) => e.target.closest(sel))
```

## Example

```js
// Data shape: { id: string } stored in each row
const list = document.querySelector("#todo-list");

list.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action=delete]");
  if (!button) return; // click on padding or plain text

  const item = button.closest("li");
  console.log("deleting", item.dataset.id);
  item.remove();
});
```

## Details

Delegation survives re-rendering. A listener attached to each row is lost as soon as the row is replaced, which is the usual cause of a button that works once.

Guard the case where `closest` returns `null`, and keep the selector narrow so a click in the container itself does not match.
