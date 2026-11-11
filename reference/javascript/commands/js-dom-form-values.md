# reading form controls

JavaScript command · DOM forms

Reads control state. Text values are always strings, checkboxes and radios use checked, and a select exposes value plus selectedOptions.

## Syntax

```js
form.elements.customer_email.value
```

## Example

```js
// Data shape: { customer_email: string, rooms: boolean, city: string }
const form = document.querySelector("#booking-form");

const email = form.elements.customer_email.value;
const rooms = form.elements.rooms.checked;
const city = form.elements.city.value;
const adults = Number(form.elements.adults.value);

console.log(email, rooms, city, adults);
```

## Details

`form.elements` allows lookup by name, and a name that collides with a form property such as `submit` shadows it. Choose field names that cannot collide with the form API.

Radio buttons with the same name form a group. `form.elements.rooms.value` returns the checked value or an empty string.
