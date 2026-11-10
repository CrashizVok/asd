# Destructuring

JavaScript topic · Exam Wiki

```js
const { name, age = 18 } = user;
const { name: userName } = user;        // rename
const [first, second, ...rest] = [1, 2, 3, 4];
function show({ name, price }) { return `${name}: ${price}`; }
```
Defaults apply only when the value is `undefined`, not when it is `null`.
