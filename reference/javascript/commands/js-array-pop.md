# pop()

JavaScript command · Add and remove

Removes the last element and returns it. Returns undefined when the array is empty.

## Syntax

```js
array.pop()
```

## Example

```js
// Data shape: stack of page names
const stack = ['home', 'hotels', 'detail'];

const last = stack.pop();
console.log(last);  // 'detail'
console.log(stack); // ['home', 'hotels']

console.log([].pop()); // undefined, no throw

// A stack loop that stops on the empty case
while (stack.length > 0) {
  console.log(stack.pop());
}
```

## Details

`pop` and `push` together make a stack: last in, first out. Both work at the end of the array, so neither moves the other elements and both stay fast on large lists.
