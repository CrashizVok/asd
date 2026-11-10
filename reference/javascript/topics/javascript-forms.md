# Forms

JavaScript topic · Exam Wiki

```js
const input = document.querySelector("#email");
input.value;      // current text
input.checked;    // checkbox state
input.focus();
input.setCustomValidity(""); // clear a custom error
```
Read on `input` for live feedback, on `change` for selects. Validate on submit and blur, not every keystroke.
