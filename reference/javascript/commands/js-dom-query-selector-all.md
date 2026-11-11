# querySelectorAll: static list

JavaScript command · DOM selection

querySelector returns the first matching element or null. querySelectorAll returns a static NodeList of every match, so it does not update after the page changes.

## Syntax

```js
document.querySelectorAll(".card")
```

## Example

```js
// Data shape: NodeList of Element
const title = document.querySelector("h1");
const cards = document.querySelectorAll(".hotel-card");

console.log(title ? title.textContent : "no heading");
console.log(cards.length);

// A NodeList is not an array. Spread it before map or filter.
const ids = [...cards].map((card) => card.dataset.hotelId);
console.log(ids);
```

## Details

An invalid selector throws a `SyntaxError` instead of returning `null`.

`element.querySelector` searches only inside that element:

```js
const form = document.querySelector("#booking-form");
const email = form.querySelector("input[name=customer_email]");
```

Use `:scope` when the match must be a direct child:

```js
const rows = document.querySelectorAll("#room-list > li");
```
