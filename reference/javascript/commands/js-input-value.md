# input value and checked

JavaScript command · Events

Reads or sets a form control. value is a string; convert it with Number when needed.

## Syntax

```js
input.value
checkbox.checked
```

## Example

```js
const email = document.querySelector("#email");
const adults = document.querySelector("#adults");
const agree = document.querySelector("#agree");

console.log(email.value);
console.log(Number(adults.value));
console.log(agree.checked);
```
