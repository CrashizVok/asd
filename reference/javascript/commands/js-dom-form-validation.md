# constraint validation

JavaScript command · DOM forms

Constraint checks live on input.validity. Clear a custom message with an empty string, then check or report the form.

## Syntax

```js
input.setCustomValidity("")
```

## Example

```js
const form = document.querySelector("#booking-form");
const email = form.elements.customer_email;

email.setCustomValidity("");

if (!email.value.includes("@")) {
  email.setCustomValidity("Enter a valid email address");
}

console.log(form.checkValidity()); // false while the message is set
form.reportValidity();            // shows the browser message
```

## Details

The browser blocks the `submit` event while a constraint fails. Your own submit handler will not run for an invalid form unless the form has `novalidate`. That is a common exam trick: a handler that seems broken is simply never called.

`setCustomValidity("")` clears the error. Forgetting the empty call leaves the field permanently invalid.
