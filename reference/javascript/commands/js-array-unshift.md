# unshift()

JavaScript command · Add and remove

Adds values at the front and returns the new length. Every existing element moves up.

## Syntax

```js
array.unshift(...values)
```

## Example

```js
// Data shape: list of recent searches, newest first
const recent = ['Graz'];

const size = recent.unshift('Vienna');
console.log(size);   // 2
console.log(recent); // ['Vienna', 'Graz']

recent.unshift('Linz', 'Salzburg');
console.log(recent); // ['Linz', 'Salzburg', 'Vienna', 'Graz']
```

## Details

The values keep their argument order, so `unshift('a', 'b')` puts `a` before `b`. Like `shift`, it moves the whole array, so it is the expensive end. If the list is only read from the front, `push` plus a reverse at the end is cheaper.
