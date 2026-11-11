# Promise.race()

JavaScript command · Combinators

Settles with the first promise that settles, success or failure. The slower promises keep running and their results are ignored.

## Syntax

```js
await Promise.race([p1, p2])
```

## Example

```js
const winner = await Promise.race([
  loadHotels(),
  wait(2000).then(() => {
    throw new Error("timeout");
  })
]);
console.log(winner);
```
