# addEventListener options

JavaScript command · Events

The third argument controls capture, once, passive, and an abort signal. Removal needs the same function and the same capture flag.

## Syntax

```js
el.addEventListener("click", fn, { once: true })
```

## Example

```js
const button = document.querySelector("#save");

button.addEventListener("click", () => {
  console.log("runs once");
}, { once: true });

const controller = new AbortController();

window.addEventListener("resize", onResize, { signal: controller.signal });
document.addEventListener("keydown", onKey, { signal: controller.signal });

function onResize() {}
function onKey() {}

controller.abort(); // removes both listeners at once
```

## Details

`passive: true` promises not to call `preventDefault`, which lets the browser scroll without waiting. A `preventDefault` inside a passive listener is ignored.

Adding the same function twice for the same type and capture flag does nothing. Different `once` or `passive` values do not create a second listener.
