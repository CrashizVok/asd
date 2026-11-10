# localStorage

JavaScript command · Storage

Stores strings in the browser across reloads. Use JSON.stringify and JSON.parse for objects.

## Syntax

```js
localStorage.setItem("key", "value")
localStorage.getItem("key")
```

## Example

```js
localStorage.setItem("theme", "dark");
console.log(localStorage.getItem("theme")); // dark

const user = { name: "Anna" };
localStorage.setItem("user", JSON.stringify(user));
const saved = JSON.parse(localStorage.getItem("user"));
```
