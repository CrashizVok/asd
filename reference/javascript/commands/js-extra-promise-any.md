# Promise.any()

JavaScript command · Promises

Resolves with the first fulfilled promise and ignores rejections. It fails only when every promise rejects.

## Syntax

```js
Promise.any(iterable)
```

## Example

```js
const slow = new Promise((resolve) => setTimeout(() => resolve("mirror-1"), 300));
const fast = new Promise((resolve) => setTimeout(() => resolve("mirror-2"), 100));
const dead = Promise.reject(new Error("offline"));

// The fastest success wins, even though one input fails
console.log(await Promise.any([slow, fast, dead])); // "mirror-2"

// All rejected gives an AggregateError with every reason
try {
  await Promise.any([Promise.reject(new Error("a")), Promise.reject(new Error("b"))]);
} catch (error) {
  console.log(error.name);          // "AggregateError"
  console.log(error.errors.length); // 2
}
```
