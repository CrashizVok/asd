# event.preventDefault()

React command · Form submission

Stops the browser from submitting the form as a page navigation, which would reload and drop React state.

## Syntax

```jsx
event.preventDefault()
```

## Example

```jsx
function handleSubmit(event) {
  event.preventDefault(); // no navigation, state survives
  const found = validate(form);
  setErrors(found);
  if (Object.keys(found).length > 0) return;
  onSubmit(form);
}
```

## Details

A form without a handler submits to its `action` with a GET request, reloading the page. In a single page app that resets every piece of state and looks like a bug in the reset logic.

Call it before validation and before any `await`. The first line of the handler is the right place, so nobody adds a `return` above it later.

A button inside a form defaults to `type="submit"`. A button that only clears fields needs `type="button"`, or it will submit the form and fire `preventDefault` on the wrong path.
