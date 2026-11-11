# async function

JavaScript command · async/await

Marks a function that always returns a promise and may use await inside. A returned value fulfils the promise, a thrown error rejects it.

## Syntax

```js
async function name() { return value; }
```

## Example

```js
async function countHotels() {
  const hotels = await loadHotels();
  return hotels.length; // wrapped in a promise
}

countHotels().then((n) => console.log(n));
```
