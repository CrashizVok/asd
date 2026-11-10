# optional chaining ?.

JavaScript command · Objects

Stops and returns undefined when a value is null or undefined, instead of throwing.

## Syntax

```js
obj?.prop?.method?.()
```

## Example

```js
const hotel = { owner: { name: "Anna" } };

console.log(hotel.owner?.name);    // Anna
console.log(hotel.contact?.email); // undefined
```
