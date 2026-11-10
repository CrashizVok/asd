# localStorage

JavaScript topic · Exam Wiki

```js
localStorage.setItem("token", "abc123");
localStorage.getItem("token");   // string or null
localStorage.setItem("user", JSON.stringify(user));
const saved = JSON.parse(localStorage.getItem("user") || "null");
```
Only strings are stored. Never store secrets; any script on the page can read them.
