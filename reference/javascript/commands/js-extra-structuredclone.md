# structuredClone()

JavaScript command · Objects

Makes a deep copy of value. It handles Map, Set, Date, and typed arrays, but not functions or class methods.

## Syntax

```js
structuredClone(value)
```

## Example

```js
const original = {
  name: "Danube View",
  rooms: [{ number: 101, guests: ["Anna"] }],
  tags: new Set(["spa"])
};

const copy = structuredClone(original);
copy.rooms[0].guests.push("Bela");
copy.tags.add("pool");

console.log(original.rooms[0].guests); // ["Anna"], nested arrays are independent
console.log(original.tags.has("pool")); // false

// Functions cannot be cloned and throw DataCloneError
try {
  structuredClone({ save() {} });
} catch (error) {
  console.log(error.name); // "DataCloneError"
}
```
