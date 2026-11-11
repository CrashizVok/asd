# getAttribute and setAttribute

JavaScript command · DOM styling

Attributes are strings. getAttribute returns null when the attribute is missing, and a boolean attribute such as disabled works by presence, not by value.

## Syntax

```js
element.setAttribute("aria-hidden", "true")
```

## Example

```js
// <a id="details" href="/rooms/4" target="_blank">
const link = document.querySelector("#details");

console.log(link.getAttribute("href")); // "/rooms/4"
console.log(link.href);                 // full absolute URL

link.setAttribute("aria-label", "Open room 4");
link.removeAttribute("target");

const email = document.querySelector("#email");
console.log(email.value);               // current text
console.log(email.getAttribute("value")); // default from the HTML
```

## Details

`setAttribute("disabled", "false")` still disables the control. Remove the attribute to enable it.

A property such as `checked` is the live state. The attribute `checked` is the default state, and changing it does not change what the user sees.
