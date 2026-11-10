# Array methods

JavaScript topic · Exam Wiki

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
