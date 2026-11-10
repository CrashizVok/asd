# JSON

JavaScript topic · Exam Wiki

```js
const text = JSON.stringify({ id: 1, name: "Anna" });
const obj = JSON.parse('{"id":1,"name":"Anna"}');
JSON.stringify(obj, null, 2); // pretty print
```
`JSON.parse` throws on bad input. Functions and `undefined` vanish during stringify.
