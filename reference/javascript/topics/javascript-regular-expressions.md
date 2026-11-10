# Regular expressions

JavaScript topic · Exam Wiki

```js
const email = "book@example.com";
const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

console.log(pattern.test(email));        // true
console.log(email.match(/@(.+)$/)[1]);   // example.com
console.log("a-b-c".replace(/-/g, "_")); // a_b_c
console.log("2026-11-10".split(/-/));    // ["2026", "11", "10"]
```

`test` returns a boolean, `match` returns the match array, `replace` swaps text, `split` cuts a string. Flags: `g` all matches, `i` ignore case, `m` multiline. Escape a literal dot as `\.`.
