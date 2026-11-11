# Object.entries()

JavaScript command · Objects

Turns an object into an array of [key, value] pairs, which lets you use array methods on it.

## Syntax

```js
Object.entries(object)
```

## Example

```js
const stars = { "Danube View": 4, "City Loft": 5, "Lake Garden": 3 };

for (const [name, value] of Object.entries(stars)) {
  console.log(name, value);
}

// Filter and rebuild an object from the pairs
const top = Object.fromEntries(
  Object.entries(stars).filter(([, value]) => value >= 4)
);
console.log(top); // { "Danube View": 4, "City Loft": 5 }

// Keys only, values only
console.log(Object.keys(stars).length); // 3
console.log(Object.values(stars));      // [4,5,3]
```
