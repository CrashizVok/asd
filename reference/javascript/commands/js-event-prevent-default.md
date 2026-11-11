# preventDefault

JavaScript command · Events

Cancels the browser default for a cancelable event. A non-cancelable event ignores the call, and a passive listener cannot use it.

## Syntax

```js
event.preventDefault()
```

## Example

```js
const form = document.querySelector("#booking-form");

form.addEventListener("submit", (event) => {
  event.preventDefault(); // no page reload, no navigation
  const data = Object.fromEntries(new FormData(form));
  console.log(data);
});

const link = document.querySelector("a.confirm");

link.addEventListener("click", (event) => {
  if (!confirm("Leave the booking?")) event.preventDefault();
});
```

## Details

`preventDefault` must run during dispatch. Calling it after the handler returns, for example inside a timeout, changes nothing.

Check `event.defaultPrevented` when another part of the page may already have cancelled the action.
