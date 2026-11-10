# Map

JavaScript command · Collections

A key/value collection that allows any key type and keeps insertion order. Use it over an object when keys are dynamic.

## Syntax

```js
const map = new Map()
map.set(key, value)
```

## Example

```js
const counts = new Map();
counts.set("Anna", 2);
counts.set("Ben", 1);

console.log(counts.get("Anna")); // 2
console.log(counts.has("Cara")); // false
for (const [name, total] of counts) {
  console.log(name, total);
}
```
