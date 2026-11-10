# Arrow functions

JavaScript topic · Exam Wiki

```js
const double = (n) => n * 2;
const greet = (name) => { const text = `Hi ${name}`; return text; };
```
Short body without braces returns implicitly. Arrow functions do not bind their own `this`, so avoid them as object methods or handlers that need `this`.
