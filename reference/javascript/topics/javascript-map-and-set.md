# Map and Set

JavaScript topic · Exam Wiki

```js
const counts = new Map();
counts.set("Anna", 2);
counts.set("Ben", 1);
counts.set("Anna", counts.get("Anna") + 1);
console.log(counts.get("Anna")); // 3
console.log(counts.has("Ben"));  // true
console.log(counts.size);        // 2

for (const [name, count] of counts) {
    console.log(name, count);
}

const unique = new Set(["A", "B", "A"]);
console.log(unique.size);     // 2
console.log(unique.has("B")); // true
const list = [...unique];     // back to an array
```

A `Map` keeps key order and accepts any key type. A plain object only has string and symbol keys. A `Set` stores unique values. Both are iterable with `for...of`.
