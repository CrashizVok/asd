# Object.assign()

JavaScript command · Objects

Copies own enumerable properties into the target and returns it. Later sources overwrite earlier ones.

## Syntax

```js
Object.assign(target, ...sources)
```

## Example

```js
const defaults = { stars: 3, city: "Budapest", breakfast: false };
const overrides = { stars: 5, breakfast: true };

// The first object is mutated, so pass a fresh one to keep defaults clean
const hotel = Object.assign({}, defaults, overrides);
console.log(hotel); // { stars: 5, city: "Budapest", breakfast: true }
console.log(defaults.stars); // 3, untouched

// The copy is shallow: nested objects are shared
const source = { rooms: { count: 10 } };
const clone = Object.assign({}, source);
clone.rooms.count = 99;
console.log(source.rooms.count); // 99, the nested object was shared
```
