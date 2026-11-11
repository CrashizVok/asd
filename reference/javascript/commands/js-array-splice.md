# splice()

JavaScript command · Add and remove

Removes elements from a position, optionally inserts new ones, and returns the removed elements.

## Syntax

```js
array.splice(start, deleteCount, ...items)
```

## Example

```js
// Data shape: ordered list of stop names
const stops = ['A', 'B', 'C', 'D'];

const removed = stops.splice(1, 2);
console.log(removed); // ['B', 'C']
console.log(stops);   // ['A', 'D']

// Insert without deleting
stops.splice(1, 0, 'X', 'Y');
console.log(stops); // ['A', 'X', 'Y', 'D']

// Negative start counts from the end
stops.splice(-1, 1);
console.log(stops); // ['A', 'X', 'Y']
```

## Details

The start position, the number to delete, then the values to insert. Omitting `deleteCount` deletes to the end, so `splice(0)` empties the array and returns everything. The method mutates the original and returns a new array of removed elements. Keep it apart from `slice`, which copies and mutates nothing.
