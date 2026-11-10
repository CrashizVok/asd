# DOM traversal

JavaScript topic · Exam Wiki

```js
const card = document.querySelector(".card");

card.parentElement;          // the container
card.children;               // element children
card.firstElementChild;      // first element child
card.lastElementChild;       // last element child
card.nextElementSibling;     // next element
card.previousElementSibling; // previous element
card.closest(".grid");       // nearest ancestor matching a selector
card.matches(".card.active"); // true or false
```

`children` contains elements only. `childNodes` also contains text and comments. `closest` walks up the tree and is useful for event delegation.
