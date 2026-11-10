# Events

JavaScript topic · Exam Wiki

```js
document.querySelector("#book").addEventListener("click", (event) => {
  event.preventDefault();
  console.log(event.target);
});
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(Object.fromEntries(new FormData(e.target)));
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
```
`preventDefault` stops the browser action. `stopPropagation` stops bubbling. Delegate on a parent and check `event.target` for re-rendered children.
