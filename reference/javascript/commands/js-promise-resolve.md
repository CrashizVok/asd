# Promise.resolve()

JavaScript command · Promises

Returns an already fulfilled promise. Useful as a default value or to start a chain with a known value.

## Syntax

```js
Promise.resolve(value)
```

## Example

```js
const start = Promise.resolve({ hotel_id: 1 });

start
  .then((hotel) => hotel.hotel_id)
  .then((id) => console.log(id)); // 1
```
