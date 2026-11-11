---
id: js-promises-deep
lang: JavaScript
title: Promises
---

# Promises

## Simplest form

```js
// Data shape: a Promise is a box with one of three states.
// pending, fulfilled with a value, or rejected with a reason (usually an Error).
// Smallest useful promise: resolve after 300 ms with the string "done".
const later = new Promise((resolve) => {
  setTimeout(() => resolve("done"), 300);
});

later.then((value) => console.log(value)); // "done" after 300 ms
```

## What a promise is for

A promise is a placeholder for a value that does not exist yet. The value arrives from a timer, a network call, a file read, or a user action. The promise itself is an ordinary object you can pass around, store in a variable, return from a function, and attach handlers to. Nothing runs until you attach a handler or await it.

Three states, and only one transition:

- `pending`: no value yet.
- `fulfilled`: the value is there. `resolve(value)` caused it.
- `rejected`: the value will never come. `reject(reason)` caused it.

Once a promise leaves `pending` it is settled, and it stays settled. Calling `resolve` twice does nothing the second time. Calling `reject` after `resolve` does nothing either. This is why a promise is safe to hand to several consumers: they all see the same outcome.

## Callbacks, the thing promises replaced

Before promises, an asynchronous function took a function argument and called it when the work finished. The convention was error first.

```js
// Data shape: callback(error, result). One of the two arguments is always null.
function loadHotels(callback) {
  setTimeout(() => {
    const failure = null;
    const hotels = [{ hotel_id: 1, name: "Lakeview", city: "Zurich", stars: 4 }];
    callback(failure, hotels);
  }, 200);
}

loadHotels((error, hotels) => {
  if (error) {
    console.error(error.message);
    return;
  }
  console.log(hotels.length);
});
```

This works while there is one step. The trouble starts when each step needs the previous result. A booking needs a hotel, the hotel needs an owner, the owner needs a city. Every step adds a level of indentation, and every level repeats the `if (error)` check. The `return` matters: forget it and the code falls through into the success branch with a null value.

There is a second problem. A callback can be called twice by a careless function, and nothing in the language stops it. A promise can settle once, and the runtime enforces that for you.

Wrapping an error-first function in a promise turns the nesting into a flat chain:

```js
function loadHotels() {
  return new Promise((resolve, reject) => {
    // the old callback style, adapted
    setTimeout(() => resolve([{ hotel_id: 1, city: "Zurich" }]), 200);
  });
}

loadHotels()
  .then((hotels) => hotels[0].city)
  .then((city) => console.log(city)) // "Zurich"
  .catch((error) => console.error(error.message));
```

## The Promise constructor

`new Promise(executor)` runs the executor immediately, synchronously, before the constructor returns. The executor receives `resolve` and `reject`.

```js
// Data shape: executor(resolve, reject) => void.
// resolve(value) fulfils, reject(reason) rejects. Whichever runs first wins.
function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const timed = new Promise((resolve, reject) => {
  const started = Date.now();
  if (Number.isNaN(Number(started))) reject(new Error("clock broken"));
  else resolve(started);
});
```

Things the constructor does not give you for free:

- An exception thrown inside the executor rejects the promise. You do not need to catch it yourself.
- Returning a value from the executor does nothing. Only `resolve` and `reject` matter.
- The executor is not called again, and it is not retried. Retry is your own loop.
- `resolve` with another promise adopts its state. This is how a function can return a promise that resolves to a promise without extra nesting.

Most application code should not call `new Promise` at all. If an API already returns a promise, wrap nothing. If an API is callback based, wrap once at the edge and keep the wrapper small.

## then, catch, finally

`then(onFulfilled, onRejected)` registers handlers and returns a new promise. That new promise is the key to chaining: whatever the handler returns becomes its value.

```js
// Data shape: then handler returns a value, a promise, or throws.
const p = Promise.resolve(2);

const next = p.then((n) => n * 10); // Promise fulfilled with 20
next.then((n) => console.log(n)); // 20
```

`catch(onRejected)` is shorthand for `then(undefined, onRejected)`. It catches a rejection from any earlier link in the chain, not only from the one just before it.

`finally(onFinally)` runs on both outcomes and receives no argument. It cannot see the value or the reason, which is the point: use it for cleanup that does not depend on the result, such as hiding a spinner or closing a connection. A `finally` handler that returns a value is ignored unless it throws or returns a rejected promise.

```js
// Data shape: finally gets no arguments and passes the original outcome through.
showSpinner();
loadBookings()
  .then((rows) => render(rows))
  .catch((error) => renderError(error.message))
  .finally(() => hideSpinner());
```

One subtlety worth remembering for the exam: a `catch` handler that returns a normal value turns a rejected chain into a fulfilled one. The next `then` runs with that value. If you want the error to keep travelling, rethrow it.

```js
loadBookings()
  .catch((error) => {
    console.warn("first attempt failed", error.message);
    throw error; // keep the chain rejected
  })
  .catch((error) => renderError(error.message));
```

## Chaining rules that decide behaviour

A handler can return three kinds of things, and each has a different effect on the next link.

1. A plain value. The next `then` receives it.
2. A promise. The chain waits for that promise and the next `then` receives its value. This is how sequential steps stay flat.
3. A throw. The chain rejects and skips every `then` until the next `catch`.

Forgetting to return is the most common bug in a chain. This version logs `undefined` and then fetches nothing:

```js
// wrong: the arrow body has braces, so nothing is returned
loadHotels().then((hotels) => {
  hotels.map((hotel) => hotel.name); // no return
});
```

The fix is one keyword, or removing the braces.

## Timing: promises are microtasks

Promise handlers do not run immediately and they do not run on the next timer tick. They run in the microtask queue, which is drained after the current synchronous code and before timers and rendering.

```js
console.log("1 sync");
setTimeout(() => console.log("4 timer"), 0);
Promise.resolve().then(() => console.log("3 microtask"));
console.log("2 sync");
// 1 sync, 2 sync, 3 microtask, 4 timer
```

This is why a `.then` placed after a long synchronous loop still runs late: the loop has to finish first. It is also why a promise chain that resolves a thousand times in a row can block rendering, because microtasks drain before the browser gets a paint.

## Combinators: all, allSettled, race

`Promise.all(iterable)` waits for every promise and fulfils with an array of results in the same order as the input. It rejects as soon as one input rejects, and it does not cancel the others.

```js
// Data shape: input array of promises, output array of values in input order.
const [hotels, bookings] = await Promise.all([loadHotels(), loadBookings()]);
```

The order guarantee is independent of completion order. If `loadBookings` finishes first, its result is still at index 1.

`Promise.allSettled(iterable)` never rejects. It waits for all and returns an array of outcome objects, each either `{ status: "fulfilled", value }` or `{ status: "rejected", reason }`. Use it when one bad request should not hide the rest of the page.

```js
const results = await Promise.allSettled([loadHotels(), loadBookings()]);
const hotels = results[0].status === "fulfilled" ? results[0].value : [];
```

`Promise.race(iterable)` settles with the first promise that settles, whether it fulfils or rejects. It is a timeout tool, not a fastest-result tool, because a rejection also wins the race. `Promise.any` is the one that ignores rejections and resolves with the first success.

```js
// Data shape: two promises in, the outcome of the first one to settle out.
const winner = await Promise.race([
  loadHotels(),
  wait(2000).then(() => {
    throw new Error("timeout");
  })
]);
```

`race` does not stop the slower work. `loadHotels` still runs to completion in the background and its result is dropped. If that matters, cancel it, which is what `AbortController` does for fetch.

## async and await

`async` before a function does two things: it makes the function return a promise, and it allows `await` inside. `await` pauses the async function until the promise settles, then evaluates to its value. It does not block the thread. Other code keeps running while the function waits.

```js
// Data shape: async function always returns a Promise, even when it returns a number.
async function countHotels() {
  const hotels = await loadHotels();
  return hotels.length; // wrapped as Promise<number>
}

const value = await countHotels(); // only valid inside another async function
```

Inside an async function, a thrown error becomes a rejection of the returned promise. That is why `try/catch` works with `await` in a way it never did with plain callbacks.

```js
async function loadPage() {
  try {
    const hotels = await loadHotels();
    render(hotels);
  } catch (error) {
    renderError(error.message);
  } finally {
    hideSpinner();
  }
}
```

An `await` in a loop runs the calls one after another. That is correct when each call needs the previous result, and a performance bug when it does not.

```js
// slow: each request starts only after the previous one ends
for (const id of ids) {
  results.push(await loadHotel(id));
}

// fast: all requests start together, then all results are collected
const results = await Promise.all(ids.map((id) => loadHotel(id)));
```

## Race conditions in user interfaces

A race condition appears when two responses can arrive in either order, and your code assumes one order. Search boxes show it plainly. The user types `z`, then `zu`, then `zur`. Three requests leave. If the response for `z` arrives last, the list shows results for `z` while the input says `zur`.

Two cures, often combined:

1. Compare a request token before rendering. Keep a counter, and drop any response whose token is not the current one.
2. Abort the previous request when a new one starts, so the stale response never arrives.

```js
// Data shape: one counter, one controller, both replaced per keystroke.
let latest = 0;
let controller = null;

async function search(city) {
  const token = ++latest;
  controller?.abort();
  controller = new AbortController();

  try {
    const response = await fetch(`/api/hotels?city=${encodeURIComponent(city)}`, {
      signal: controller.signal
    });
    const rows = await response.json();
    if (token !== latest) return; // a newer search won
    render(rows);
  } catch (error) {
    if (error.name === "AbortError") return; // expected, not a failure
    renderError(error.message);
  }
}
```

## Loading and error states

A promise has no built in notion of progress. The screen needs one, so keep it in a small state object and set it in three places: before the request, in the success branch, in the failure branch.

```js
// Data shape: { status: "idle" | "loading" | "success" | "error", data, message }
const state = { status: "idle", data: [], message: "" };
```

Render from `state`, never from a mix of booleans. Two booleans allow the impossible combination `loading: true, error: true`, and the UI then shows a spinner over an error box.

## Examples

### Example 1: turning a timer into a reusable promise

```js
// wait(ms) is the smallest promise most projects need.
// It replaces setTimeout in async code and makes delays awaitable.

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function main() {
  console.log("start");
  await wait(500);
  console.log("half a second later");
  await wait(500);
  console.log("one second total");
}

main();
```

### Example 2: retry with backoff

```js
// Data shape: retry(fn, attempts) resolves with fn's value or rejects with the last error.
// Each failure doubles the delay: 300, 600, 1200 ms.

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retry(task, attempts = 3, delay = 300) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      console.warn(`attempt ${attempt} failed: ${error.message}`);
      if (attempt < attempts) await wait(delay * 2 ** (attempt - 1));
    }
  }

  throw lastError;
}

// usage: the last error reaches the caller's catch
retry(() => loadHotels(), 3)
  .then((hotels) => console.log(`${hotels.length} hotels`))
  .catch((error) => console.error("gave up:", error.message));
```

The loop awaits only the delay, not the whole task twice. The `return` inside `try` exits the function on success, so no flag is needed. If every attempt fails, the original error is rethrown, which keeps the caller's `catch` meaningful.

### Example 3: partial failure with allSettled

```js
// Data shape: three independent loaders, one broken on purpose.
// The page renders what arrived and names what failed.

function loadHotels() {
  return wait(200).then(() => [
    { hotel_id: 1, name: "Lakeview", city: "Zurich" },
    { hotel_id: 2, name: "Harbour", city: "Lisbon" }
  ]);
}

function loadBookings() {
  return wait(300).then(() => {
    throw new Error("bookings service down");
  });
}

function loadOwners() {
  return wait(100).then(() => [{ owner_email: "owner@example.com", first_name: "Sam" }]);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loadDashboard() {
  const [hotels, bookings, owners] = await Promise.allSettled([
    loadHotels(),
    loadBookings(),
    loadOwners()
  ]);

  const problems = [];

  if (hotels.status === "fulfilled") renderHotels(hotels.value);
  else problems.push("hotels");

  if (bookings.status === "fulfilled") renderBookings(bookings.value);
  else problems.push("bookings");

  if (owners.status === "fulfilled") renderOwners(owners.value);
  else problems.push("owners");

  if (problems.length) renderWarning(`Could not load: ${problems.join(", ")}`);
}

loadDashboard();
```

### Example 4: a booking dashboard that waits for the right answer

```js
// A full small app. No network, but the shape matches a real fetch version.
// Read it top to bottom: state, fake API, render, controller, wiring.

// 1. One state object drives every render.
const state = {
  status: "idle", // idle | loading | success | error
  city: "",
  hotels: [],
  bookings: [],
  message: ""
};

// 2. The fake API returns promises and can be slow or fail.
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function apiHotels(city) {
  await wait(city.length * 120); // longer city names answer slower, on purpose
  if (city === "nowhere") throw new Error("no hotels in that city");
  return [
    { hotel_id: 1, name: "Lakeview", city, stars: 4, owner_email: "o1@example.com" },
    { hotel_id: 2, name: "Harbour", city, stars: 3, owner_email: "o2@example.com" }
  ];
}

async function apiBookings(hotelId) {
  await wait(150);
  return [
    { booking_id: 10, hotel_id: hotelId, first_name: "Anna", adults: 2, children: 0 },
    { booking_id: 11, hotel_id: hotelId, first_name: "Luis", adults: 1, children: 1 }
  ];
}

// 3. Render reads state only. It never starts work.
function render() {
  const output = document.querySelector("#output");
  if (!output) return;

  if (state.status === "loading") {
    output.textContent = "Loading hotels...";
    return;
  }

  if (state.status === "error") {
    output.textContent = `Error: ${state.message}`;
    return;
  }

  const hotels = state.hotels
    .map((hotel) => `${hotel.name} (${hotel.stars} stars, ${hotel.city})`)
    .join("\n");

  const bookings = state.bookings
    .map((booking) => `#${booking.booking_id} ${booking.first_name} ${booking.adults}+${booking.children}`)
    .join("\n");

  output.textContent = `${hotels}\n\nBookings\n${bookings || "none yet"}`;
}

// 4. A token rejects stale answers. A counter is enough for one page.
let requestId = 0;

async function loadCity(city) {
  const token = ++requestId;

  state.status = "loading";
  state.city = city;
  state.message = "";
  render();

  try {
    // Two independent calls run together, not one after the other.
    const [hotels, bookings] = await Promise.all([
      apiHotels(city),
      apiBookings(1)
    ]);

    if (token !== requestId) return; // a later keystroke already won

    state.status = "success";
    state.hotels = hotels;
    state.bookings = bookings;
  } catch (error) {
    if (token !== requestId) return;
    state.status = "error";
    state.message = error.message;
  } finally {
    if (token === requestId) render();
  }
}

// 5. Wiring. Debounce keeps the number of requests low, the token keeps order.
let timer = null;

document.querySelector("#city")?.addEventListener("input", (event) => {
  const city = event.target.value.trim();
  clearTimeout(timer);
  timer = setTimeout(() => {
    if (city) loadCity(city);
  }, 250);
});

loadCity("Zurich");
```

Three behaviours are worth naming. The `finally` runs for both branches, so a spinner can never be left on. The token check appears in both branches, because the stale answer can be a success as easily as a failure. The two loaders run in parallel because neither needs the other's result, and `Promise.all` rejects if either fails, which is acceptable here since the page needs both.

## Common mistakes

- Returning nothing from a `then` handler with braces, then wondering why the next handler gets `undefined`.
- Forgetting that `catch` swallows the error unless you rethrow. A silent `catch` is how pages end up empty with no message.
- Assuming `Promise.all` cancels the other promises when one rejects. It does not, and the work continues.
- Using `Promise.race` as a timeout without handling the fact that the loser keeps running.
- Building a promise around a promise, for example `new Promise((resolve) => resolve(fetch(url)))`. Return the original promise instead.
- Putting `await` in a `map` callback. `map` returns an array of promises, not values. Wrap the array in `Promise.all`.
- Forgetting that an async function returns a promise. `const data = loadPage()` gives a promise, `const data = await loadPage()` gives the value.
- Starting a request in an event handler with no token or abort, so the slowest response decides the screen.
- Treating `finally` as a place to read the result. It receives nothing and must not replace the outcome.

## Exam checklist

- Name the three promise states and say which transitions are allowed.
- Explain what the executor does, when it runs, and what happens to a throw inside it.
- Say what `then` returns and how that enables chaining.
- Distinguish `catch` from `finally`, including what each receives.
- State the difference between `Promise.all`, `Promise.allSettled`, and `Promise.race` in one line each.
- Explain why `all` results keep input order regardless of finish order.
- Convert an error first callback function into a promise returning one.
- Write an async function with `try/catch/finally` and say what each block receives.
- Explain why `await` inside a loop is slower than `Promise.all` with `map`.
- Describe a stale response race in a search box and give the token and abort cures.
- Name the state fields a loading and error UI needs, and why two booleans are not enough.
