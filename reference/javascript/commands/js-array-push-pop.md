# push, pop, shift, unshift

JavaScript command · Arrays

push adds to the end, pop removes from the end, unshift adds to the start, shift removes from the start. They change the array.

## Syntax

```js
list.push(value)
list.pop()
```

## Example

```js
const list = ["a", "b"];
list.push("c");    // ["a", "b", "c"]
list.pop();        // ["a", "b"]
list.unshift("z"); // ["z", "a", "b"]
list.shift();      // ["a", "b"]
```
