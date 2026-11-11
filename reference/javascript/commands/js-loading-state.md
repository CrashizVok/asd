# loading and error state

JavaScript command · UI state

One object drives the screen: idle, loading, success, or error. Two booleans allow loading and error at the same time.

## Syntax

```js
state = { status, data, message }
```

## Example

```js
const state = { status: "idle", data: [], message: "" };

async function load() {
  state.status = "loading";
  render();
  try {
    state.data = await loadHotels();
    state.status = "success";
  } catch (error) {
    state.message = error.message;
    state.status = "error";
  }
  render();
}
```
