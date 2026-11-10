# event delegation

JavaScript command · Events

One listener on a parent handles clicks on many children, including future ones.

## Syntax

```js
parent.addEventListener("click", e => e.target.closest(...))
```

## Example

```js
const list = document.querySelector(".card-grid");

list.addEventListener("click", (event) => {
  const card = event.target.closest(".card");
  if (!card) return;
  console.log(card.dataset.id);
});
```
