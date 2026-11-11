# FormData: collect fields

JavaScript command · DOM forms

Collects successful controls as key and value pairs. Disabled fields, unchecked checkboxes, and the submit button are skipped.

## Syntax

```js
new FormData(form)
```

## Example

```js
const form = document.querySelector("#booking-form");
const data = new FormData(form);

console.log(data.get("customer_email"));
console.log(data.getAll("children")); // repeated names keep every value

for (const [key, value] of data.entries()) {
  console.log(key, value);
}

// Repeated names collapse to the last value here.
const plain = Object.fromEntries(data);
console.log(plain);
```

## Details

Pass the submitter to include the button that submitted the form:

```js
form.addEventListener("submit", (event) => {
  const data = new FormData(form, event.submitter);
});
```

File inputs produce `File` objects, which can be sent with `fetch` without reading the file first.
