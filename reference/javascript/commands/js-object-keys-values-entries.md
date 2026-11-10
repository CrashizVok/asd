# Object.keys, values, entries

JavaScript command · Objects

Returns an array of keys, values, or [key, value] pairs.

## Syntax

```js
Object.keys(obj)
Object.values(obj)
Object.entries(obj)
```

## Example

```js
const hotel = { name: "Danube View", stars: 4 };

console.log(Object.keys(hotel));    // ["name", "stars"]
console.log(Object.values(hotel));  // ["Danube View", 4]
console.log(Object.entries(hotel)); // [["name", "Danube View"], ["stars", 4]]
```
