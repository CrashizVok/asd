# Promise

JavaScript command · Async

Represents a value that will arrive later. Use then, catch, and finally, or async/await.

## Syntax

```js
new Promise((resolve, reject) => { ... })
```

## Example

```js
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

wait(500).then(() => {
  console.log("half a second later");
});
```
