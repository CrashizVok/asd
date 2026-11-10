# JavaScript cheatsheet

Compact reference for the exam. Type the examples, do not just read them.

## Variables
```js
let count = 0;      // reassignable
const rate = 0.27;  // binding fixed
var old = 1;        // function scoped, avoid
```
Use `const` by default, `let` when it changes. A `const` object can still be mutated; only the binding is fixed.

## Types
```js
typeof "hi"        // "string"
typeof 42          // "number"
typeof undefined   // "undefined"
typeof null        // "object" (known quirk)
typeof (() => 1)   // "function"
Array.isArray([])  // true, reliable array check
```
Primitives: string, number, boolean, undefined, null, symbol, bigint. Everything else is an object. Numbers are doubles, so `0.1 + 0.2 !== 0.3`.

## Operators
```js
5 % 2      // 1, remainder
2 ** 3     // 8, power
5 == "5"   // true, loose, avoid
5 === "5"  // false, strict, use
null ?? "fallback"   // "fallback"
false || "fallback"  // "fallback"
user?.address?.city  // undefined, no throw
```
`??` falls back only for `null` and `undefined`. `||` falls back for every falsy value, including `0` and `""`, which is a common bug.

## Conditionals
```js
if (score > 90) grade = "A";
else if (score > 75) grade = "B";
else grade = "C";

const label = count === 1 ? "item" : "items";
switch (role) { case "admin": allow = true; break; default: allow = false; }
```

## Loops
```js
for (let i = 0; i < 3; i++) console.log(i);
for (const item of list) console.log(item);   // values
for (const key in obj) console.log(key);      // keys
while (n < 3) n++;
list.forEach((x, i) => console.log(i, x));
```
`for...of` works on arrays, strings, Maps and Sets. `for...in` is for object keys. `break` exits, `continue` skips the round.

## Functions
```js
function add(a, b = 0) { return a + b; }
const sub = function (a, b) { return a - b; };
function total(...nums) { return nums.reduce((s, n) => s + n, 0); }
```
No `return` gives `undefined`. Extra arguments are ignored. Rest `...` collects the extras into an array.

## Arrow functions
```js
const double = (n) => n * 2;
const greet = (name) => { const text = `Hi ${name}`; return text; };
```
Short body without braces returns implicitly. Arrow functions do not bind their own `this`, so avoid them as object methods or handlers that need `this`.

## Arrays
```js
const nums = [3, 1, 4, 1, 5];
nums.length;        // 5
nums.push(9);       // add to end
nums.pop();         // remove from end
nums.slice(1, 3);   // copy, no mutation
nums.splice(1, 2);  // removes items, mutates
nums.includes(4);   // true
nums.join(", ");    // "3, 1, 4, 1, 5"
```
`push` and `pop` change the array. `slice` copies. `splice` edits in place and returns the removed items.

## Array methods
```js
const rooms = [{ name: "A", price: 80, free: true }, { name: "B", price: 120, free: false }, { name: "C", price: 60, free: true }];
rooms.map((r) => r.name);                   // ["A", "B", "C"]
rooms.filter((r) => r.free);                // A and C
rooms.reduce((sum, r) => sum + r.price, 0); // 260
rooms.find((r) => r.price < 100);           // A
rooms.sort((a, b) => a.price - b.price);    // cheapest first
rooms.some((r) => !r.free);                 // true
rooms.every((r) => r.price > 50);           // true
```
`map`, `filter` and `slice` return new arrays. `sort` and `reverse` mutate. Without a compare function, `sort` compares strings and puts `100` before `20`.

## Objects
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

## Destructuring
```js
const { name, age = 18 } = user;
const { name: userName } = user;        // rename
const [first, second, ...rest] = [1, 2, 3, 4];
function show({ name, price }) { return `${name}: ${price}`; }
```
Defaults apply only when the value is `undefined`, not when it is `null`.

## Spread
```js
const a = [1, 2];
const b = [...a, 3];                 // [1, 2, 3]
const merged = { ...user, age: 31 }; // shallow copy plus override
Math.max(...a);                      // spread into arguments
```
Spread copies one level. Nested objects still share references.

## Strings
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

## Dates
```js
const d = new Date("2026-11-10T14:00:00");
d.getFullYear();
d.getMonth();      // 0 based, January is 0
d.getDate();       // day of month
d.toISOString();   // "2026-11-10T13:00:00.000Z"
Date.now();        // milliseconds since 1970
```
Month is zero based, which causes most date bugs. Compare with `getTime()`. `new Date("2026-11-10")` is UTC midnight; `new Date(2026, 10, 10)` is local.

## JSON
```js
const text = JSON.stringify({ id: 1, name: "Anna" });
const obj = JSON.parse('{"id":1,"name":"Anna"}');
JSON.stringify(obj, null, 2); // pretty print
```
`JSON.parse` throws on bad input. Functions and `undefined` vanish during stringify.

## localStorage
```js
localStorage.setItem("token", "abc123");
localStorage.getItem("token");   // string or null
localStorage.setItem("user", JSON.stringify(user));
const saved = JSON.parse(localStorage.getItem("user") || "null");
```
Only strings are stored. Never store secrets; any script on the page can read them.

## DOM selection and creation
```js
const one = document.querySelector(".card");
const all = document.querySelectorAll(".card"); // static list
one.textContent = "New text";
one.classList.add("active");
one.dataset.id;   // reads data-id
const li = document.createElement("li");
li.textContent = "New room";
one.append(li);
li.remove();
```
`innerHTML +=` re-parses the block and drops listeners. Build nodes instead.

## Events
```js
document.querySelector("#book").addEventListener("click", (event) => {
  event.preventDefault();
  console.log(event.target);
});
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(Object.fromEntries(new FormData(e.target)));
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
```
`preventDefault` stops the browser action. `stopPropagation` stops bubbling. Delegate on a parent and check `event.target` for re-rendered children.

## Forms
```js
const input = document.querySelector("#email");
input.value;      // current text
input.checked;    // checkbox state
input.focus();
input.setCustomValidity(""); // clear a custom error
```
Read on `input` for live feedback, on `change` for selects. Validate on submit and blur, not every keystroke.

## fetch with async/await
```js
async function loadRooms() {
  const res = await fetch("/api/rooms");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
async function sendBooking(payload) {
  const res = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Booking failed");
  return res.json();
}
```
`fetch` rejects only on network failure. A 404 resolves, so check `res.ok`. `res.json()` returns a promise, hence the second `await`.

## Error handling
```js
try {
  const data = JSON.parse(text);
  save(data);
} catch (err) {
  console.error("Bad JSON:", err.message);
} finally {
  spinner.hidden = true;
}
```
`finally` always runs. Rethrow when the caller must know: `throw new Error("context", { cause: err })`. Custom errors extend `Error`.

## Modules
```js
// math.js
export const add = (a, b) => a + b;
export default function multiply(a, b) { return a * b; }
// app.js
import multiply, { add } from "./math.js";
```
Named exports need braces on import, the default does not. In the browser the tag needs `type="module"`. In Node use `.mjs` or `"type": "module"` in `package.json`.
