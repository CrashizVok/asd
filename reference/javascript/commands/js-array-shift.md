# shift()

JavaScript command · Add and remove

Removes the first element and returns it, moving every remaining element one place left.

## Syntax

```js
array.shift()
```

## Example

```js
// Data shape: queue of ticket ids
const queue = [101, 102, 103];

const first = queue.shift();
console.log(first); // 101
console.log(queue); // [102, 103]

console.log([].shift()); // undefined

// A queue drain
while (queue.length > 0) {
  console.log(queue.shift());
}
```

## Details

Every call moves the remaining elements to a lower index, which costs time proportional to the length. Draining a list of ten thousand items with `shift` is much slower than walking it with a `for` loop. Use `shift` on short lists or keep an index pointer for long ones.
