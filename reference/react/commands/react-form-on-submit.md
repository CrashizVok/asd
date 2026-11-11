# submit handler

React command · Form submission

Attach to form onSubmit and preventDefault first. Without it the browser reloads and state is lost.

## Syntax

```jsx
function handleSubmit(event) { event.preventDefault(); }
```

## Example

```jsx
async function handleSubmit(event) {
  event.preventDefault();
  const found = validate(form);
  setErrors(found);
  if (Object.keys(found).length > 0) return;

  setSaving(true);
  try {
    await onSave(form);
  } finally {
    setSaving(false);
  }
}
```

## Details

`onSubmit` on the form catches both the button click and the Enter key inside a text field. A click handler on the button catches only the click.

Validate before the request, and return early when the errors object is not empty. Disable the button while the request runs (`disabled={saving}`) so a second click does not post the same booking twice.

Read any `event.target.value` before the first `await`; after the request the DOM node may be gone even though the event object still exists.
