# dataset

JavaScript command · DOM styling

Reads and writes data-* attributes as camelCase keys. Every value is a string, including numbers you assign.

## Syntax

```js
element.dataset.hotelId
```

## Example

```js
// <li data-hotel-id="42" data-city="Budapest">
const item = document.querySelector("li");

console.log(item.dataset.hotelId);          // "42"
console.log(Number(item.dataset.hotelId) + 1); // 43

item.dataset.stars = 4;   // writes data-stars="4"
delete item.dataset.city; // removes data-city

console.log(item.getAttribute("data-stars")); // "4"
```

## Details

HTML lowercases attribute names. `data-hotelId` in markup becomes `data-hotelid`, which does not match `dataset.hotelId`. Write kebab case in HTML and camelCase in JavaScript.

After `delete`, the key reads as `undefined`, not `null`.
