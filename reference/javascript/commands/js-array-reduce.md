# reduce

JavaScript command · Arrays

Reduces the array to one value. The second argument is the starting value.

## Syntax

```js
array.reduce((total, item) => total + item, 0)
```

## Example

```js
const bookings = [2, 3, 1, 4];
const guests = bookings.reduce((total, n) => total + n, 0);

console.log(guests); // 10
```
