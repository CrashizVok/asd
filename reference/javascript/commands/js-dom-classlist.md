# classList

JavaScript command · DOM

Adds, removes, toggles, and checks classes without editing the class string.

## Syntax

```js
element.classList.add("active")
```

## Example

```js
const card = document.querySelector(".card");
card.classList.add("is-open");
card.classList.toggle("is-open");
console.log(card.classList.contains("is-open")); // false
```
