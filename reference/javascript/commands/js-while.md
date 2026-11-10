# while and do...while

JavaScript command · Control flow

while checks before each run. do...while runs at least once.

## Syntax

```js
while (condition) { ... }
do { ... } while (condition);
```

## Example

```js
let tries = 0;

while (tries < 3) {
  tries++;
}

let again;
do {
  again = false;
} while (again);
```
