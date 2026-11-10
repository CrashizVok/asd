# DOM selection and creation

JavaScript topic · Exam Wiki

```js
const one = document.querySelector(".card");
const all = document.querySelectorAll(".card"); // static list
one.textContent = "New text";
one.classList.add("active");
one.dataset.id;   // reads data-id
const li = document.createElement("li");
li.textContent = "New room";
one.append(li);
li.remove();
```
`innerHTML +=` re-parses the block and drops listeners. Build nodes instead.
