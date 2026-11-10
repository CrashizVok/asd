# FormData

JavaScript command · Events

Collects form fields as key/value pairs. Use get, getAll, and entries.

## Syntax

```js
const data = new FormData(form)
```

## Example

```js
const form = document.querySelector("form");
const data = new FormData(form);

console.log(data.get("email"));
for (const [key, value] of data.entries()) {
  console.log(key, value);
}
```
