# Strings

JavaScript topic · Exam Wiki

```js
const s = "  Hotel Room  ";
s.trim();             // "Hotel Room"
s.includes("Room");   // true
s.replace("Room", "Suite");
s.split(" ");         // array of words
"abc".padStart(5, "-"); // "--abc"
`${user.name} is ${user.age}`;
```
Strings are immutable. Every method returns a new string.
