# &&, ||, !, ??

JavaScript command · Operators

Logical AND, OR, NOT, and nullish coalescing. ?? returns the right side only when the left is null or undefined.

## Syntax

```js
a && b
a || b
!a
a ?? b
```

## Example

```js
const name = "";
const display = name || "Guest"; // "Guest"
const count = 0;
const safe = count ?? 10;        // 0
const total = count || 10;       // 10
```
