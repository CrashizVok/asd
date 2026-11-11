# input and change

JavaScript command · Forms and keyboard

input fires on every value change, including paste and drop. change fires when the user commits: on blur for text, immediately for checkbox, radio, select, and date fields.

## Syntax

```js
input.addEventListener("input", fn)
select.addEventListener("change", fn)
```

## Example

```js
const search = document.querySelector("#search");
let timer;

search.addEventListener("input", (event) => {
  if (event.isComposing) return; // IME is mid-word
  clearTimeout(timer);
  timer = setTimeout(() => {
    console.log("filter for", search.value.trim());
  }, 150);
});

document.querySelector("#city").addEventListener("change", (event) => {
  console.log("city committed", event.target.value);
});
```

## Details

Use `input` for live feedback and `change` for an action that should run once per decision.

A debounce timer stops an expensive filter from running on every keystroke. The composition guard keeps a half-typed Japanese or Chinese word from being searched.
