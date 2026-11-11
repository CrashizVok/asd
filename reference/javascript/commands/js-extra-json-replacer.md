# JSON.stringify() with replacer

JavaScript command · JSON

Serializes a value. The replacer filters or rewrites properties before they are written, which is how secrets are dropped.

## Syntax

```js
JSON.stringify(value, replacer, space?)
```

## Example

```js
const hotel = {
  name: "Danube View",
  stars: 4,
  owner_email: "owner@example.com",
  password: "not-for-json"
};

// An array of names keeps only those keys
const safe = JSON.stringify(hotel, ["name", "stars"]);
console.log(safe); // {"name":"Danube View","stars":4}

// A function replacer can transform values
const masked = JSON.stringify(hotel, (key, value) => {
  if (key === "password") return undefined; // undefined removes the key
  if (key === "owner_email") return "hidden";
  return value;
});
console.log(masked);

// The third argument sets indentation, here two spaces
console.log(JSON.stringify(hotel, ["name"], 2));
```
