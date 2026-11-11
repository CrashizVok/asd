# submit

JavaScript command · Forms and keyboard

Fires on the form for a submit button click and for Enter in a single-line field. An invalid form blocks the event unless the form has novalidate.

## Syntax

```js
form.addEventListener("submit", fn)
```

## Example

```js
const form = document.querySelector("#booking-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form, event.submitter);

  console.log("submitted by", event.submitter ? event.submitter.name : "Enter");
  console.log(data.get("customer_email"));
});

// requestSubmit runs validation and fires submit. submit() skips both.
// form.requestSubmit();
```

## Details

A button inside a form defaults to `type="submit"`. A button that must only run script needs `type="button"`.

Pressing Enter in a `textarea` inserts a newline and does not submit, so a chat-style editor can live inside a form safely.
