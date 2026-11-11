# element.querySelector

JavaScript command · DOM selection

Searches only inside the element, not the whole document. Use it when several cards or forms repeat the same inner markup.

## Syntax

```js
form.querySelector("input[name=customer_email]")
```

## Example

```js
const form = document.querySelector("#booking-form");
const email = form.querySelector("input[name=customer_email]");

const cards = document.querySelectorAll(".hotel-card");

// Each card looks up its own title, not the first title on the page.
for (const card of cards) {
  console.log(card.querySelector("h2").textContent);
}

console.log(email.value);
```
