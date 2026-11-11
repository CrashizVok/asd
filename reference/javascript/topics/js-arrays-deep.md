# JavaScript arrays

JavaScript topic · Exam Wiki

An array holds many values under one name and keeps them in the order you put them in. The exam asks you to read a value at an index, grow and shrink the list, and rewrite data with `map`, `filter` and `reduce` without looping by hand. Those three things are the core, and everything else in this page supports them.

## Simplest form

```js
// Data shape: one ordered list of values, reached by index from 0
const scores = [12, 7, 30];

scores[0];      // 12, first element
scores.length;  // 3, number of slots
scores[2] = 31; // replace the last value
scores[3] = 8;  // append at the end, length becomes 4
```

Read the block from the top. The square brackets create the array, not a call to a function. Index `0` is the first element, so the last element sits at `length - 1`. Assigning to an index that already exists replaces the value. Assigning to an index equal to `length` appends.

## What an array really is

An array is an object whose keys are numeric strings and whose `length` property tracks the highest index plus one. This matters for three exam facts.

`typeof []` returns `"object"`, so the only reliable test is `Array.isArray(value)`. A plain object with numeric keys is not an array and will fail that test.

An array is a reference. `const copy = original` copies the pointer, not the contents. Editing `copy` edits `original`, because both names point at the same list. Real copies come from `slice`, spread, or `Array.from`.

`length` is not the count of values you wrote. It is one more than the highest index. If you write `arr[9] = 1` on an empty array, length becomes 10 and indexes 0 to 8 are holes. A hole reads as `undefined`, but `forEach`, `map` and `filter` skip it, and `JSON.stringify` turns it into `null`. Keeping arrays dense avoids every one of those surprises.

## Creating arrays

The literal is the normal way. Use the other forms when the data comes from somewhere else.

```js
// Data shape: a fixed list of numbers
const literal = [1, 2, 3];

// From any iterable: string, Set, another array, a NodeList
const letters = Array.from('abc');            // ['a', 'b', 'c']
const unique = Array.from(new Set([1, 1, 2])); // [1, 2]

// Array.of keeps the argument as one value
Array.of(7);      // [7]
new Array(7);     // 7 empty slots, length 7, this is a trap

// Build a sequence without a loop
const even = Array.from({ length: 4 }, (_, index) => index * 2); // [0, 2, 4, 6]

// Fixed-size grid, every cell filled
const grid = new Array(3).fill(0); // [0, 0, 0]

// Copy an array into a new one
const copy = [...literal];
```

`new Array(7)` is the one to remember as dangerous: one numeric argument means length, not element. `new Array(7, 8)` means two elements. When you want a single element, use `Array.of` or a literal.

`fill` writes the same value into every slot. With objects that is a shared reference in each slot, so `new Array(3).fill({})` gives three keys to one object.

## Index, at, and length

```js
// Data shape: list of cities
const cities = ['Vienna', 'Graz', 'Linz'];

cities[0];                  // 'Vienna'
cities[cities.length - 1];  // 'Linz', the old way
cities.at(-1);              // 'Linz', modern and readable
cities[5];                  // undefined, no error
cities.length = 2;          // truncates, 'Linz' is gone
```

Negative indexes do not read from the end. `cities[-1]` is a normal property lookup, finds nothing, and returns `undefined`. `at` accepts a negative number and does the arithmetic for you.

Setting `length` smaller destroys the elements above it. Setting it larger adds holes. Both are allowed and both are silent, so a typo in `length` can quietly delete half of your list.

Writing past the end is also silent. `cities[10] = 'Salzburg'` leaves eight holes and a length of 11. Checking `includes` afterwards will not tell you the array is now sparse.

## Adding and removing at the ends

```js
// Data shape: a queue of names
const queue = ['Ana', 'Bela'];

queue.push('Csilla');   // returns 3, queue is now three names
queue.pop();            // returns 'Csilla', removes the last name
queue.unshift('Dora');  // returns 3, adds at the front
queue.shift();          // returns 'Dora', removes the first name
```

`push` and `pop` work at the end and are cheap. `unshift` and `shift` work at the front: every remaining element moves one slot, so they cost time proportional to the length. For a large list, a queue built from thousands of `shift` calls is slow; keep an index pointer or push and reverse once at the end.

`pop` and `shift` on an empty array return `undefined` and change nothing. They do not throw, so guards belong in your code where the empty case is real.

## splice removes and inserts in the middle

`splice(start, deleteCount, ...items)` changes the array in place and returns an array of the removed elements. It is the only method here that both deletes and inserts.

```js
// Data shape: ordered list of stop names
const stops = ['A', 'B', 'C', 'D'];

const removed = stops.splice(1, 2);      // removed is ['B', 'C']
// stops is now ['A', 'D']

stops.splice(1, 0, 'X', 'Y');            // inserts, deletes nothing
// stops is now ['A', 'X', 'Y', 'D']

stops.splice(-1, 1);                     // negative start counts from the end
// removes 'D', stops is ['A', 'X', 'Y']
```

The arguments in order: where to start, how many to delete, then what to insert. Omitting `deleteCount` deletes everything from the start position to the end. `splice(0)` therefore empties the array and returns all of it, which is a common way to drain a list.

The removed elements come back as a new array. The original keeps its identity, so other names pointing at it see the change.

## slice copies a piece

`slice(start, end)` returns a copy from `start` up to but not including `end`. It never mutates.

```js
// Data shape: list of scores in order
const scores = [10, 20, 30, 40, 50];

scores.slice(1, 3);   // [20, 30], end index 3 is not included
scores.slice(2);      // [30, 40, 50], to the end
scores.slice(-2);     // [40, 50], last two
scores.slice();       // full shallow copy
scores.slice(3, 1);   // [], start after end gives an empty array
```

The name difference is the exam favourite: `splice` mutates and returns what it removed, `slice` copies and returns what it kept.

## concat and join

`concat` glues arrays into a new one. It flattens array arguments one level, so `[1].concat([2, [3]])` gives `[1, 2, [3]]`. Spread does the same job with clearer syntax.

```js
// Data shape: two lists of tags
const a = ['red', 'green'];
const b = ['blue'];

a.concat(b);        // ['red', 'green', 'blue'], a and b unchanged
[...a, ...b];       // same result, the form most code uses now

a.join(', ');       // 'red, green'
[1, 2, 3].join(''); // '123'
```

`join` turns the whole array into one string with the separator you pass. The default separator is a comma. `null` and `undefined` elements become empty text, so `[1, null, 3].join('-')` gives `'1--3'`.

## Searching with includes, indexOf, find

```js
// Data shape: list of room numbers
const rooms = [101, 205, 309];

rooms.includes(205);   // true, compares with SameValueZero
rooms.indexOf(205);    // 1, position of the first match
rooms.indexOf(999);    // -1, the not found marker

// Data shape: list of booking objects
const bookings = [
  { hotel_id: 1, city: 'Vienna', adults: 2 },
  { hotel_id: 2, city: 'Graz', adults: 1 },
];

bookings.find((item) => item.city === 'Graz');      // the object, or undefined
bookings.findIndex((item) => item.city === 'Graz'); // 1, or -1
```

`includes` answers a yes or no and works on `NaN`. `indexOf` uses strict equality, so it never finds `NaN`, and it needs a real value, not a test function. Once your array holds objects, `includes` only works if you pass the exact same object reference. Use `find` with a predicate instead.

`find` returns the element or `undefined`. `findIndex` returns the position or `-1`. Neither throws when nothing matches, so always handle the `undefined` branch before reading a property from the result.

## Rewriting with map, filter, reduce

These three replace most manual loops. Each takes a function and leaves the original array untouched.

```js
// Data shape: list of prices in euros
const prices = [40, 15, 90];

// map: same length, one output per input
const withTax = prices.map((price) => price * 1.2); // [48, 18, 108]

// filter: keeps the items where the test returns true
const cheap = prices.filter((price) => price < 50); // [40, 15]

// reduce: folds the list into one value
const total = prices.reduce((sum, price) => sum + price, 0); // 145
```

`map` and `filter` return new arrays and never change the input. The callback receives three arguments: the element, the index, and the array itself. Most code uses only the element, and naming the rest away is fine.

`reduce` takes an accumulator and the current element. The second argument is the starting accumulator. Pass `0` for sums and `''` for strings. Without a starting value, `reduce` uses the first element as the seed and starts at index 1; on an empty array it throws `TypeError`. That throw is the reason a starting value is almost always the right choice.

`forEach` looks like `map` and is not the same. It returns `undefined`, so its purpose is a side effect such as a log line or a DOM write. If you need the resulting array, use `map`.

```js
// Data shape: list of guest names
const guests = ['Ana', 'Bela'];

guests.forEach((name, index) => {
  console.log(index, name); // 0 Ana, then 1 Bela
});
```

`some` returns true if any element passes the test, `every` returns true only if all pass. Both stop at the first answer, which makes them cheaper than `filter(...).length > 0` and clearer in meaning.

```js
// Data shape: list of booking objects with adults count
const bookings = [{ adults: 2 }, { adults: 0 }];

bookings.some((item) => item.adults === 0);  // true, one booking has none
bookings.every((item) => item.adults > 0);   // false, the second fails
```

## sort

`sort` sorts in place and, with no comparator, converts every element to a string and compares UTF-16 code units. That default is correct for words and wrong for numbers.

```js
// Data shape: list of numbers
const numbers = [10, 9, 1, 100];

numbers.sort();              // [1, 10, 100, 9], string order, a classic bug
numbers.sort((a, b) => a - b); // [1, 9, 10, 100], numeric ascending
numbers.sort((a, b) => b - a); // [100, 10, 9, 1], descending

// Data shape: list of hotel objects
const hotels = [
  { name: 'Park', stars: 3 },
  { name: 'Ring', stars: 5 },
];
hotels.sort((a, b) => b.stars - a.stars); // Ring first
```

The comparator returns a negative number when `a` should come first, a positive number when `b` should, and zero when the order does not matter. `a - b` gives ascending order for numbers. Comparing strings with `a.localeCompare(b)` is stable across languages.

`sort` changes the array it is called on. Copy first with `[...list].sort(...)` when the original order still matters. Since ES2019 the sort is stable, so items that compare equal keep their relative order, which lets you sort by one key and then by another.

## Loops over arrays

`for` with an index gives full control and allows `break`. `for...of` reads values and is the cleanest choice when you only need each element. `for...in` iterates keys, including inherited ones, and is meant for objects, not arrays.

```js
// Data shape: list of city names
const cities = ['Vienna', 'Graz'];

for (let i = 0; i < cities.length; i++) {
  console.log(i, cities[i]);
}

for (const city of cities) {
  if (city === 'Graz') break; // for...of supports break and continue
  console.log(city);
}
```

`forEach` cannot break. If you need to stop early, use `some` or a plain loop.

## Copying and immutability

All the copying methods are shallow: the outer array is new, the elements inside are the same references.

```js
// Data shape: list of booking objects
const original = [{ hotel_id: 1, city: 'Vienna' }];
const copy = [...original];

copy.push({ hotel_id: 2, city: 'Graz' }); // original stays length 1
copy[0].city = 'Linz';                    // original[0].city is now 'Linz' too

const deep = structuredClone(original);   // nested objects copied as well
```

The first mutation is safe because the outer array is new. The second reaches through the shared object. `structuredClone` copies nested data, handles `Date` and `Map`, and throws on functions. `JSON.parse(JSON.stringify(value))` is the older trick, and it silently loses functions, `undefined`, and turns dates into strings.

## Examples

### Example 1: end operations and a middle edit, step by step

```js
// Data shape: ordered list of station names
const line = ['A', 'B', 'C'];

console.log(line.push('D'));     // 4, push returns the new length
console.log(line);               // ['A', 'B', 'C', 'D']
console.log(line.pop());         // 'D'
console.log(line.shift());       // 'A', the rest moves left
console.log(line);               // ['B', 'C']
console.log(line.unshift('Z'));  // 3
console.log(line);               // ['Z', 'B', 'C']

line.splice(1, 1, 'B1', 'B2');   // remove 1 at index 1, insert two
console.log(line);               // ['Z', 'B1', 'B2', 'C']

const middle = line.slice(1, 3);
console.log(middle);             // ['B1', 'B2']
console.log(line.length);        // 4, slice did not touch the original
```

Run it in your head once. The return values differ per method, and the exam asks for them: `push` and `unshift` return the new length, `pop` and `shift` return the removed element, `splice` returns the removed array, `slice` returns the copy.

### Example 2: totals and averages with reduce

```js
// Data shape: array of booking totals in euros
const totals = [240, 120, 380, 90];

const sum = totals.reduce((acc, value) => acc + value, 0);      // 830
const count = totals.length;                                    // 4
const average = sum / count;                                    // 207.5
const max = totals.reduce((acc, value) => Math.max(acc, value), 0); // 380

console.log(sum, average, max); // 830 207.5 380

// Only the bookings above the average
const above = totals.filter((value) => value > average);
console.log(above); // [240, 380]

// A readable chain: filter, then map, then join
const labels = totals
  .filter((value) => value >= 200)
  .map((value) => `${value} EUR`)
  .join(' | ');
console.log(labels); // '240 EUR | 380 EUR'
```

The chain reads top to bottom: keep the big totals, turn each into a label, join them into one string. Each step returns a new array, so the original `totals` is still intact at the end and can be reused.

### Example 3: sorting and searching hotel records

```js
// Data shape: array of objects, each with a name and a stars number
const hotels = [
  { hotel_id: 3, name: 'Garden', city: 'Graz', stars: 4 },
  { hotel_id: 1, name: 'Ring', city: 'Vienna', stars: 5 },
  { hotel_id: 2, name: 'Park', city: 'Vienna', stars: 3 },
];

// Highest stars first, name as the tie breaker
const ranked = [...hotels].sort((a, b) => {
  if (b.stars !== a.stars) return b.stars - a.stars;
  return a.name.localeCompare(b.name);
});
console.log(ranked.map((hotel) => hotel.name)); // ['Ring', 'Garden', 'Park']

// Find one record, then guard before reading it
const ring = hotels.find((hotel) => hotel.name === 'Ring');
if (ring) console.log(ring.hotel_id); // 1

// Which positions hold Vienna hotels
const viennaIndexes = [];
hotels.forEach((hotel, index) => {
  if (hotel.city === 'Vienna') viennaIndexes.push(index);
});
console.log(viennaIndexes); // [1, 2]

// Answer questions without building intermediate arrays
console.log(hotels.some((hotel) => hotel.stars === 5));  // true
console.log(hotels.every((hotel) => hotel.stars >= 3));  // true
console.log(hotels.findIndex((hotel) => hotel.city === 'Linz')); // -1
```

Sorting a copy keeps `hotels` in its original order for later steps. Sorting in place would be fine too, but only when nothing else depends on the input order.

### Example 4: a full booking report, read from top to bottom

```js
// Data shape: each booking is an object
// { booking_id, hotel_id, city, start_date, end_date, adults, children, total }
const bookings = [
  { booking_id: 1, hotel_id: 10, city: 'Vienna', start_date: '2026-05-02',
    end_date: '2026-05-06', adults: 2, children: 0, total: 480 },
  { booking_id: 2, hotel_id: 11, city: 'Graz', start_date: '2026-05-03',
    end_date: '2026-05-04', adults: 1, children: 1, total: 150 },
  { booking_id: 3, hotel_id: 10, city: 'Vienna', start_date: '2026-06-10',
    end_date: '2026-06-17', adults: 2, children: 2, total: 910 },
  { booking_id: 4, hotel_id: 12, city: 'Linz', start_date: '2026-06-11',
    end_date: '2026-06-12', adults: 1, children: 0, total: 95 },
  { booking_id: 5, hotel_id: 11, city: 'Graz', start_date: '2026-06-20',
    end_date: '2026-06-27', adults: 2, children: 0, total: 640 },
];

// Step 1: keep the bookings that start in June.
// String comparison works here because the dates use YYYY-MM-DD.
const june = bookings.filter((booking) => booking.start_date.startsWith('2026-06'));

// Step 2: derive the number of nights from the two dates.
// Date.parse returns milliseconds, one day is 86400000 of them.
const withNights = june.map((booking) => {
  const nights = (Date.parse(booking.end_date) - Date.parse(booking.start_date))
    / 86400000;
  return { ...booking, nights, guests: booking.adults + booking.children };
});

// Step 3: compute the revenue and the average price per night.
// The initial value 0 makes reduce safe on an empty array.
const revenue = withNights.reduce((sum, booking) => sum + booking.total, 0);
const totalNights = withNights.reduce((sum, booking) => sum + booking.nights, 0);
const averageNight = totalNights === 0 ? 0 : revenue / totalNights;

// Step 4: group the revenue by city.
// The accumulator starts as an empty object and grows one key per city.
const byCity = withNights.reduce((groups, booking) => {
  groups[booking.city] = (groups[booking.city] || 0) + booking.total;
  return groups;
}, {});

// Step 5: rank the cities, biggest revenue first.
// Object.entries turns the group object into an array we can sort.
const cityRanking = Object.entries(byCity)
  .map(([city, total]) => ({ city, total }))
  .sort((a, b) => b.total - a.total);

// Step 6: find the strongest single booking and the busiest one by guests.
// spread plus sort keeps withNights in its original order.
const topBooking = [...withNights].sort((a, b) => b.total - a.total)[0];
const busiest = withNights.reduce(
  (best, booking) => (booking.guests > best.guests ? booking : best),
  withNights[0]
);

// Step 7: print the report.
console.log('June bookings:', withNights.length);
console.log('Revenue:', revenue, 'EUR');
console.log('Average per night:', averageNight.toFixed(2), 'EUR');
console.log('Top booking:', topBooking.booking_id, topBooking.total, 'EUR');
console.log('Busiest booking:', busiest.booking_id, busiest.guests, 'guests');
console.log('Cities:', cityRanking);

// A guard that costs one line and prevents a crash:
// reduce with no initial value throws on an empty list,
// so pass withNights[0] only after checking the array is not empty.
if (withNights.length > 0) {
  const cheapest = withNights.reduce((low, booking) =>
    booking.total < low.total ? booking : low
  );
  console.log('Cheapest:', cheapest.booking_id);
}
```

The script uses only array methods from this page. `filter` picks the month, `map` adds derived fields, `reduce` produces three different aggregates, `sort` ranks, and `find` style guards keep the last block safe. Notice that `map` returns a new object with `...booking` spread in, so the original records stay untouched. The final `reduce` has no starting value on purpose, and the `if` is what makes that safe.

## Common mistakes

Sorting numbers without a comparator. `[10, 9, 1].sort()` gives `[1, 10, 9]` because the default compares strings. Always pass `(a, b) => a - b`.

Using `map` for side effects. `map` builds an array you then throw away. Use `forEach` for logging or DOM writes, and keep `map` for transformations.

Forgetting the starting value in `reduce`. An empty array then throws `TypeError`. Pass `0`, `''`, `[]`, or `{}` unless you have already checked the array is not empty.

Calling `splice` when you mean `slice`. `splice` mutates and returns the removed part. `slice` copies and returns the kept part. Mixing them up destroys data or returns the wrong half.

Writing `delete arr[1]`. That leaves a hole, keeps the length, and makes `map` and `forEach` skip the slot. Use `splice(1, 1)` to remove an element.

Assuming `indexOf` finds objects or `NaN`. It uses strict equality, so two identical looking objects are different references, and `NaN !== NaN`. Use `find` for objects and `includes` for `NaN`.

Copying with `=`. `const b = a` shares one array. Use `[...a]`, `a.slice()`, or `Array.from(a)` when a real copy is needed, and remember those copies are shallow.

Looping with `for...in` over an array. It walks enumerable keys, including inherited ones and any extra property you added. Use `for...of`, a plain `for`, or `forEach`.

Changing the array inside `forEach`. Pushing or splicing during iteration shifts the remaining elements and skips some of them. Build a new array with `filter` and `map` instead.

Reading `find` without a guard. When nothing matches, `find` returns `undefined` and `result.city` throws. Check the value, or use optional chaining: `result?.city`.

Comparing arrays with `===`. Two arrays with the same contents are different objects, so the result is `false`. Compare lengths and elements, or compare `JSON.stringify` output for simple data.

## Exam checklist

- You can create an array with a literal, `Array.from`, `Array.of`, and `fill`, and you know why `new Array(3)` is not `[3]`.
- You can state the index of the first and last element without counting.
- You know which of `push`, `pop`, `shift`, `unshift`, `splice` return a length, an element, or an array.
- You can explain the difference between `splice` and `slice` in one sentence each.
- You can write a numeric `sort` comparator and say what the default sort does to `[10, 9, 1]`.
- You can pick between `includes`, `indexOf`, `find`, and `findIndex` for a given question.
- You can rewrite a loop as `filter` then `map` and keep the original array unchanged.
- You can write a `reduce` with a starting value and say when the starting value is optional.
- You know that `forEach` returns `undefined` and cannot `break`.
- You know that `some` and `every` short circuit and what they return on an empty array: `false` and `true`.
- You can copy an array shallowly in three ways and say why the copy is not deep.
- You know that setting `length` shorter deletes elements and that `delete arr[i]` leaves a hole.
- You can read a chain like `filter().map().sort().join()` and name the type at each step.

