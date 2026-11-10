# for...in

JavaScript command · Control flow

Iterates over enumerable property names. Use it for objects, not arrays.

## Syntax

```js
for (const key in object) { ... }
```

## Example

```js
const hotel = { name: "Danube View", stars: 4 };

for (const key in hotel) {
  console.log(key, hotel[key]);
}
```
