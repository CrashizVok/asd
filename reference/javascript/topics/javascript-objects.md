# Objects

JavaScript topic · Exam Wiki

```js
const user = { name: "Anna", age: 30, greet() { return `Hi ${this.name}`; } };
user.name;          // dot access
user["name"];       // bracket access, for dynamic keys
user.city = "Budapest";
delete user.age;
Object.keys(user);     // ["name", "city", "greet"]
Object.entries(user);  // [["name","Anna"], ...]
"name" in user;        // true
```
