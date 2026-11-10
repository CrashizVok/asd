# querySelector and querySelectorAll

JavaScript command · DOM

Finds the first element that matches a CSS selector. querySelectorAll returns a NodeList of all matches.

## Syntax

```js
document.querySelector(".card")
```

## Example

```js
const title = document.querySelector("h1");
const cards = document.querySelectorAll(".card");

console.log(title.textContent);
console.log(cards.length);
```
