# async and await

JavaScript command · Async

async makes a function return a Promise. await pauses inside it until the Promise settles. Use try/catch for errors.

## Syntax

```js
async function load() { const data = await fetch(url); }
```

## Example

```js
async function loadBookings() {
  try {
    const response = await fetch("/api/bookings");
    if (!response.ok) throw new Error("Request failed");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error.message);
  }
}
```
