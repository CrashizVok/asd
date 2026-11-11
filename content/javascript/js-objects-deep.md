---
id: js-objects-deep
lang: JavaScript
title: JavaScript objects
---

# JavaScript objects

An object groups named values. Where an array answers "what is at position 3", an object answers "what is stored under this name". Bookings, hotels, guests and every JSON payload the exam shows you are objects, usually nested inside arrays.

## Simplest form

```js
// Data shape: { key: value } pairs, keys are strings (or symbols)
const hotel = {
  hotel_id: 7,
  name: 'Ring',
  city: 'Vienna',
  stars: 5,
};

hotel.city;          // 'Vienna', dot access with a fixed name
hotel['stars'];      // 5, bracket access with a string
hotel.owner_email;   // undefined, the key does not exist
```

Every line in that block matters. The braces create the object. The keys on the left of each colon are names stored as strings, even when you write them without quotes. Dot access needs a key you can type in the source. Bracket access takes any expression that evaluates to a string. A missing key does not throw, it returns `undefined`, which is why the next step after reading is often a check.

## What an object is

An object is a collection of properties plus a link to a prototype. The link is why `hotel.toString` works even though you never wrote it: the method is inherited from `Object.prototype`. `Object.keys` lists only the properties the object owns.

Objects are references, like arrays. `const copy = hotel` copies the pointer, so a change through `copy` shows up in `hotel`. A real shallow copy comes from spread or `Object.assign`.

Keys are always strings or symbols. Writing `{ 1: 'a' }` stores the key `'1'`. Reading `hotel[1]` converts the number to a string and finds it. That conversion is the source of one common mistake below.

Property order is defined: integer-like keys first in ascending numeric order, then string keys in the order they were added, then symbols. Do not rely on the string order for anything except display, where insertion order is what people expect.

## Creating objects

```js
// Data shape: guest record
const guest = {
  first_name: 'Ana',
  last_name: 'Kovacs',
  email: 'ana@example.test',
};

// A key computed at runtime
const field = 'phone';
const contact = { [field]: '+1000000' }; // { phone: '+1000000' }

// Shorthand when the variable name is the key
const city = 'Graz';
const stay = { city }; // { city: 'Graz' }

// A method: a property whose value is a function
const counter = {
  value: 0,
  bump() {
    this.value += 1;   // this is the object the method was called on
    return this.value;
  },
};

counter.bump(); // 1
```

The computed key form `[expression]` is the only way to use a variable as a key inside a literal. Without brackets, `{ field: 'x' }` creates a key literally named `field`.

Method shorthand `bump() {}` is the same as `bump: function () {}` with one difference that shows up in stack traces and in `this` binding: an arrow function would not receive `this` from the call site, so methods that read `this` should stay regular functions or shorthand methods.

`Object.fromEntries` builds an object from pairs. It is the inverse of `Object.entries` and a clean way to turn a `Map` or a filtered pair list back into an object.

```js
// Data shape: list of [key, value] pairs
const pairs = [['city', 'Linz'], ['stars', 4]];
Object.fromEntries(pairs); // { city: 'Linz', stars: 4 }
```

## Reading and writing properties

```js
// Data shape: hotel record
const hotel = { name: 'Park', stars: 3 };

hotel.stars = 4;              // update an existing key
hotel.city = 'Vienna';        // add a new key
hotel['name'];                // 'Park'

const key = 'stars';
hotel[key];                   // 4, the variable is evaluated first
```

Dot access is shorter and reads better. Bracket access is required when the key comes from data, contains a space or a dash, or is stored in a variable.

Two tests answer different questions. The `in` operator checks the object and its prototype chain. `Object.hasOwn` checks only the object itself.

```js
// Data shape: plain object with one own key
const record = { hotel_id: 10 };

'hotel_id' in record;        // true
'toString' in record;        // true, inherited
Object.hasOwn(record, 'toString'); // false, not owned
```

Reading a chain of properties is unsafe when a middle link can be missing. Optional chaining stops at the first `null` or `undefined` and returns `undefined` instead of throwing.

```js
// Data shape: nested booking with an optional guest object
const booking = { hotel_id: 4, guest: null };

booking.guest.first_name;      // TypeError
booking.guest?.first_name;     // undefined, no throw
booking.room?.number ?? 'n/a'; // 'n/a', nullish fallback
```

`??` only falls back for `null` and `undefined`. `||` also falls back for `0`, `''` and `false`, which is wrong for a count or a price of zero.

## Adding and deleting

```js
// Data shape: guest record
const guest = { first_name: 'Ana', phone: '+1000000' };

guest.city = 'Graz';    // add
delete guest.phone;     // remove the whole key

guest.phone;            // undefined
'phone' in guest;       // false
```

Assigning `undefined` is not the same as deleting. `guest.phone = undefined` keeps the key with an undefined value, so `'phone' in guest` stays `true` and `Object.keys` still lists it. `JSON.stringify` drops it either way, which hides the difference until some other code checks `in`.

Deleting a key costs performance on hot objects because the engine may switch the object to a slower representation. For ordinary exam sized data this is irrelevant; for a loop over a million records, build a new object without the key instead.

## keys, values, entries

These three turn an object into an array so array methods become usable.

```js
// Data shape: city to revenue map
const revenue = { Vienna: 1390, Graz: 790, Linz: 95 };

Object.keys(revenue);    // ['Vienna', 'Graz', 'Linz']
Object.values(revenue);  // [1390, 790, 95]
Object.entries(revenue); // [['Vienna', 1390], ['Graz', 790], ['Linz', 95]]

const total = Object.values(revenue).reduce((sum, value) => sum + value, 0);
// 2275

for (const [city, value] of Object.entries(revenue)) {
  console.log(city, value);
}
```

`Object.entries` plus destructuring in the loop header is the standard way to walk an object with both key and value. `Object.keys` is enough when you only need the names, and `Object.values` when you only need the values and the order does not matter.

All three return arrays, and arrays have `filter`, `map`, `sort` and `reduce`. That is the bridge: convert, process, and convert back with `Object.fromEntries`.

```js
// Data shape: city to revenue map, keep only cities above 500
const revenue = { Vienna: 1390, Graz: 790, Linz: 95 };

const big = Object.entries(revenue)
  .filter(([, value]) => value > 500)
  .map(([city, value]) => [city, value * 2]);

Object.fromEntries(big); // { Vienna: 2780, Graz: 1580 }
```

## Destructuring

Destructuring pulls keys out into variables in one statement. The left side mirrors the shape of the right side.

```js
// Data shape: booking record
const booking = {
  hotel_id: 10,
  city: 'Vienna',
  guests: { adults: 2, children: 1 },
};

const { hotel_id, city } = booking;
const { guests: { adults } } = booking;      // nested
const { city: town } = booking;              // rename
const { stars = 3 } = booking;               // default when undefined

console.log(hotel_id, city, adults, town, stars); // 10 Vienna 1 Vienna 3
```

Defaults only apply when the value is `undefined`, not when it is `null`. A key that is absent and a key set to `undefined` behave the same here, which is usually what you want.

Destructuring also works in function parameters, and that is where it earns its place: a function that takes an options object can name only the fields it uses and give the rest defaults.

```js
// Data shape: options object, all keys optional
function describe({ city = 'unknown', stars = 0 } = {}) {
  return `${city} ${stars} stars`;
}

describe({ city: 'Graz', stars: 4 }); // 'Graz 4 stars'
describe();                            // 'unknown 0 stars'
```

The `= {}` at the end is not decoration. Without it, calling `describe()` throws, because there is nothing to destructure.

The rest element collects the remaining keys into a new object. It is how you drop a field without mutating the source.

```js
// Data shape: guest record with a secret field
const guest = { first_name: 'Ana', last_name: 'Kovacs', token: 'abc' };
const { token, ...safe } = guest;

safe; // { first_name: 'Ana', last_name: 'Kovacs' }
```

## Spread, copying, merging

```js
// Data shape: hotel record
const hotel = { hotel_id: 1, name: 'Ring', stars: 5 };

const copy = { ...hotel };                 // shallow copy
const upgraded = { ...hotel, stars: 4 };   // copy, then override one key
const merged = { ...hotel, city: 'Graz', stars: 3 }; // added key wins
```

Later keys win. That is the whole rule. Spread reads own enumerable properties in order, so the last assignment to a key is the one that survives. Two spreads where the second has the same key give the second value, and an explicit key after a spread overrides it.

The copy is shallow. Nested objects and arrays are shared references.

```js
// Data shape: booking with a nested guest object
const booking = { hotel_id: 1, guest: { first_name: 'Ana' } };
const copy = { ...booking };

copy.guest.first_name = 'Bela';
booking.guest.first_name; // 'Bela', both names point at one guest object
```

`Object.assign(target, source)` does the same merge but mutates the first argument and returns it. Spread is the safer default because it always creates a fresh object. Use `Object.assign` only when mutating a target is the point.

Deep copies need `structuredClone` or a recursive function. `structuredClone` handles plain objects, arrays, dates and maps; it throws on functions and drops nothing silently.

## JSON

JSON is a text format for moving data. It is not JavaScript: keys must be in double quotes, and the allowed values are objects, arrays, strings, numbers, booleans and `null`. No functions, no `undefined`, no comments, no trailing commas.

```js
// Data shape: booking record, JSON compatible
const booking = {
  hotel_id: 10,
  city: 'Vienna',
  adults: 2,
  start_date: '2026-05-02',
  note: null,
};

const text = JSON.stringify(booking);
// '{"hotel_id":10,"city":"Vienna","adults":2,"start_date":"2026-05-02","note":null}'

const back = JSON.parse(text);
back.city; // 'Vienna'

// Readable output for a file or a log
console.log(JSON.stringify(booking, null, 2));
```

`JSON.stringify` returns a string. `JSON.parse` takes a string and returns data. Passing an object to `parse` throws, and passing a string to `stringify` returns a quoted string, so the types must match at every step.

Some values do not survive the round trip. `undefined`, functions and symbols are dropped from objects, and become `null` inside arrays. `Date` objects become ISO strings, so `back.start_date` is a string after parsing even if it was a `Date` before. Circular references throw `TypeError`. Big integers lose precision.

The third argument of `stringify` is the indentation, and the second is a replacer. A replacer array keeps only the named keys; a replacer function can rewrite or drop values.

```js
// Data shape: booking with fields that should not leave the server
const booking = { hotel_id: 10, city: 'Vienna', token: 'secret', adults: 2 };

JSON.stringify(booking, ['hotel_id', 'city', 'adults']);
// '{"hotel_id":10,"city":"Vienna","adults":2}'
```

`parse` accepts a reviver as its second argument, which runs on every key and can convert dates back into `Date` objects. That is the counterpart of the replacer.

## Nested data

Real exam data is an array of objects, each object holding another object or an array. Read it in two steps: get to the right level, then loop there.

```js
// Data shape: one hotel, with an array of bookings inside
const hotel = {
  hotel_id: 3,
  name: 'Garden',
  city: 'Graz',
  stars: 4,
  bookings: [
    { booking_id: 1, adults: 2, children: 0, total: 300 },
    { booking_id: 2, adults: 1, children: 2, total: 250 },
  ],
};

hotel.bookings.length;                        // 2
hotel.bookings[0].adults;                     // 2
hotel.bookings.map((item) => item.total);     // [300, 250]
hotel.bookings
  .filter((item) => item.children > 0)
  .map((item) => item.booking_id);            // [2]
```

The rule of thumb: one dot per level down, then hand the array to `map` or `filter`. When a level may be missing, put `?.` there. When the whole chain may be missing, `??` gives a fallback.

To collect nested values into one flat array, `flatMap` does the loop and the flattening together.

```js
// Data shape: list of hotels, each with a bookings array
const hotels = [
  { name: 'Ring', bookings: [{ total: 100 }, { total: 200 }] },
  { name: 'Park', bookings: [{ total: 50 }] },
];

hotels.flatMap((hotel) => hotel.bookings.map((item) => item.total));
// [100, 200, 50]
```

## Comparing and freezing

`===` on two objects compares references, not contents. `{ a: 1 } === { a: 1 }` is `false`. To compare contents, compare the fields you care about, or compare `JSON.stringify` output when key order is guaranteed and the data is JSON safe.

`Object.freeze` makes the top level read only. New keys cannot be added, existing keys cannot be changed, and deleting fails silently outside strict mode, throws inside it. Nested objects stay mutable, which surprises people who expect a deep freeze.

```js
// Data shape: hotel record, frozen
const hotel = Object.freeze({ hotel_id: 1, name: 'Ring' });
hotel.name = 'Park'; // silently ignored, still 'Ring'
```

## Examples

### Example 1: read, update, copy, and delete

```js
// Data shape: guest record with four keys
const guest = {
  first_name: 'Ana',
  last_name: 'Kovacs',
  email: 'ana@example.test',
  phone: '+1000000',
};

// Read both ways
console.log(guest.first_name);        // 'Ana'
console.log(guest['email']);          // 'ana@example.test'

// Update one key, add one key
guest.phone = '+2000000';
guest.city = 'Vienna';
console.log(guest); // five keys, phone changed

// Copy, then edit the copy
const copy = { ...guest, city: 'Graz' };
copy.email = 'other@example.test';

console.log(guest.city);  // 'Vienna', untouched
console.log(copy.city);   // 'Graz'

// Remove a key from the copy only
delete copy.phone;
console.log('phone' in copy);  // false
console.log('phone' in guest); // true
```

The spread creates a new outer object, so `copy` and `guest` hold the same values but are not the same object. `delete` on `copy` leaves `guest` alone. If `guest` had a nested object, that part would still be shared, which is the limit of a shallow copy.

### Example 2: destructuring, entries, and a rebuild

```js
// Data shape: city to revenue map
const revenue = { Vienna: 1390, Graz: 790, Linz: 95 };

// Pull out two known keys
const { Vienna, Graz } = revenue;
console.log(Vienna, Graz); // 1390 790

// Walk every pair with destructuring in the loop header
for (const [city, value] of Object.entries(revenue)) {
  console.log(`${city}: ${value} EUR`);
}

// Keep the cities above 500, double their revenue, rebuild the object
const doubled = Object.fromEntries(
  Object.entries(revenue)
    .filter(([, value]) => value > 500)
    .map(([city, value]) => [city, value * 2])
);

console.log(doubled);              // { Vienna: 2780, Graz: 1580 }
console.log(Object.keys(doubled).length); // 2
console.log(Object.values(revenue));      // [1390, 790, 95]
```

The pair array is the unit of work here. `filter` looks at the value at index 1, `map` builds a new pair, and `fromEntries` turns the pairs back into an object.

### Example 3: JSON round trip with a reviver

```js
// Data shape: booking with a date stored as a Date object
const booking = {
  hotel_id: 10,
  city: 'Vienna',
  start_date: new Date('2026-05-02'),
  adults: 2,
};

const text = JSON.stringify(booking);
console.log(text);
// {"hotel_id":10,"city":"Vienna","start_date":"2026-05-02T00:00:00.000Z","adults":2}

const plain = JSON.parse(text);
console.log(typeof plain.start_date); // 'string', the Date is gone

// A reviver turns the field back into a Date during parsing
const restored = JSON.parse(text, (key, value) => {
  if (key === 'start_date') return new Date(value);
  return value;
});

console.log(restored.start_date instanceof Date); // true
console.log(restored.start_date.getUTCFullYear()); // 2026
```

The reviver runs from the innermost value outward. Checking the key name is the usual approach; converting every string that looks like a date is risky because it changes fields you did not intend to touch.

### Example 4: a full booking report over nested data

```js
// Data shape:
// hotels: array of hotel records
// { hotel_id, name, city, stars, owner_email,
//   bookings: [{ booking_id, start_date, end_date, adults, children, total }] }
const hotels = [
  {
    hotel_id: 10,
    name: 'Ring',
    city: 'Vienna',
    stars: 5,
    owner_email: 'owner10@example.test',
    bookings: [
      { booking_id: 1, start_date: '2026-05-02', end_date: '2026-05-06',
        adults: 2, children: 0, total: 480 },
      { booking_id: 3, start_date: '2026-06-10', end_date: '2026-06-17',
        adults: 2, children: 2, total: 910 },
    ],
  },
  {
    hotel_id: 11,
    name: 'Garden',
    city: 'Graz',
    stars: 4,
    owner_email: 'owner11@example.test',
    bookings: [
      { booking_id: 2, start_date: '2026-05-03', end_date: '2026-05-04',
        adults: 1, children: 1, total: 150 },
      { booking_id: 5, start_date: '2026-06-20', end_date: '2026-06-27',
        adults: 2, children: 0, total: 640 },
    ],
  },
  {
    hotel_id: 12,
    name: 'Station',
    city: 'Linz',
    stars: 3,
    owner_email: 'owner12@example.test',
    bookings: [],
  },
];

// Step 1: flatten every booking, keeping the hotel it belongs to.
// flatMap runs the inner map, then joins the results into one array.
const allBookings = hotels.flatMap((hotel) =>
  hotel.bookings.map((booking) => ({
    ...booking,               // copy the booking fields
    hotel_id: hotel.hotel_id, // add the link back to the hotel
    hotel_name: hotel.name,
    city: hotel.city,
  }))
);

// Step 2: count nights per booking.
// YYYY-MM-DD strings compare and parse without a library.
const withNights = allBookings.map((booking) => {
  const nights = (Date.parse(booking.end_date) - Date.parse(booking.start_date))
    / 86400000;
  return { ...booking, nights };
});

// Step 3: total revenue, total guests, and revenue by city.
// reduce with an object accumulator is the standard grouping trick.
const revenue = withNights.reduce((sum, booking) => sum + booking.total, 0);

const guests = withNights.reduce(
  (sum, booking) => sum + booking.adults + booking.children,
  0
);

const byCity = withNights.reduce((groups, booking) => {
  groups[booking.city] = (groups[booking.city] || 0) + booking.total;
  return groups;
}, {});

// Step 4: rank hotels by revenue.
// Map each hotel to a small summary, then sort the summaries.
const hotelTotals = hotels
  .map((hotel) => ({
    name: hotel.name,
    city: hotel.city,
    stars: hotel.stars,
    bookings: hotel.bookings.length,
    total: hotel.bookings.reduce((sum, booking) => sum + booking.total, 0),
  }))
  .sort((a, b) => b.total - a.total);

// Step 5: find the busiest booking without sorting.
// reduce keeps one winner and compares as it walks.
const busiest = withNights.reduce(
  (best, booking) => {
    const seats = booking.adults + booking.children;
    const bestSeats = best.adults + best.children;
    return seats > bestSeats ? booking : best;
  },
  withNights[0] // guarded below; withNights is known not to be empty here
);

// Step 6: build the report object and print it as JSON.
const report = {
  generated_for: 'owners',
  booking_count: withNights.length,
  revenue,
  guests,
  by_city: byCity,
  top_hotels: hotelTotals.slice(0, 2),
  busiest_booking: busiest
    ? { booking_id: busiest.booking_id, hotel_name: busiest.hotel_name }
    : null,
};

console.log(JSON.stringify(report, null, 2));

// Step 7: a per owner summary, using a Map for the grouping.
// A Map is safer than an object when keys come from data.
const perOwner = new Map();
for (const hotel of hotels) {
  const key = hotel.owner_email;
  perOwner.set(key, (perOwner.get(key) || 0) + hotel.bookings.length);
}
console.log([...perOwner.entries()]);

// Step 8: a guard for the empty input case.
// reduce on an empty array without an initial value throws,
// so check before the call when the data can be empty.
if (withNights.length === 0) {
  console.log('No bookings to report');
}
```

Every block reuses one idea: turn the nested structure into a flat array, then use array methods on it. `flatMap` flattens hotels into bookings, `map` adds derived fields, `reduce` produces the totals and the grouping object, and `sort` ranks. `hotelTotals` shows the other direction, where the outer array is processed and each nested `bookings` array is reduced inside the `map` callback. The last `if` documents the empty case instead of hiding it.

## Common mistakes

Using a variable without brackets. `{ field: 'x' }` creates a key named `field`. `{ [field]: 'x' }` evaluates the variable. The second form is the one that uses your data.

Mutating an object you meant to copy. Spread and `Object.assign` are shallow, so `copy.guest.name = 'x'` also changes `original.guest.name`. Deep copy with `structuredClone` when nested writes are possible.

Comparing objects with `===`. Two objects with identical keys and values are still different references. Compare the fields, or `JSON.stringify` both when the data is JSON safe and the key order matches.

Treating `undefined` as a missing key. `obj.key = undefined` keeps the key. `Object.keys` lists it and `'key' in obj` is true. Use `delete` when the key itself must go.

Expecting JSON to keep everything. Functions and `undefined` disappear from objects, `Date` becomes a string, `NaN` becomes `null`, and a circular reference throws. Convert dates deliberately with a reviver.

Parsing JSON that is already an object. `JSON.parse(booking)` throws because `parse` expects text. `JSON.stringify(booking)` throws in the other direction when the value contains a circular reference.

Reading `null` with a default. `const { guest = {} } = booking` does not replace `guest: null`. Defaults apply to `undefined` only, so use `booking.guest ?? {}` when `null` is possible.

Using `||` for a numeric default. `total || 0` looks harmless until `total` is a real `0`; the fallback then replaces a valid value. `??` falls back only for `null` and `undefined`, which is almost always what "missing" means.

Forgetting `this` in a method. An arrow function inside an object literal captures `this` from the surrounding scope, which is usually `undefined` in a module. Method shorthand or a regular function gets `this` from the call.

Relying on key order for logic. Integer-like keys sort first, string keys follow insertion order, and `Object.keys` shows that mixed order. Iterate a list of keys you control when order matters.

Deleting a key inside a loop over `Object.keys`. The array is a snapshot so the loop finishes, but reads after the delete can see stale values. Build the filtered object with `Object.fromEntries` instead.

## Exam checklist

- You can create an object literal with fixed keys, computed keys, shorthand values, and a method.
- You can read a property with dot and bracket access and say when each is required.
- You can explain what a missing key returns and why that is not an error.
- You can add, update, and delete a key, and state the difference between `delete` and assigning `undefined`.
- You can tell `in` from `Object.hasOwn` and say which one sees inherited properties.
- You can write `Object.keys`, `Object.values`, and `Object.entries` output for a given object, in the right order.
- You can destructure a nested object, rename a key, give a default, and collect the rest.
- You can merge two objects with spread and say which value wins on a duplicate key.
- You know that spread copies one level and can explain what is still shared.
- You can serialize an object with `JSON.stringify`, parse it back, and name two values that do not survive.
- You can read a nested structure like `hotels[0].bookings[1].total` and guard a level that may be missing.
- You can group an array of objects into an object keyed by a field, using `reduce`.
- You can compare two objects by field values, not by reference, and say why `===` fails.
