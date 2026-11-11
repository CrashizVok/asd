# classList methods

JavaScript command · DOM styling

Adds, removes, toggles, replaces, and tests classes one at a time. Assigning className replaces every class on the element.

## Syntax

```js
element.classList.add("is-open")
```

## Example

```js
const card = document.querySelector(".hotel-card");

card.classList.add("is-open");
card.classList.toggle("is-open");
console.log(card.classList.contains("is-open")); // false

card.classList.replace("is-open", "is-closed");

// Avoid this in a component: it wipes every other class.
// card.className = "is-open";
```

## Details

`toggle` takes a second argument that forces the state:

```js
card.classList.toggle("is-hidden", !matches);
```

SVG elements expose `className` as an object, not a string, so `classList` is the portable choice.
