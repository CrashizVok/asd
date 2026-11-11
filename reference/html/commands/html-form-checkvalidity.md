# form checkValidity()

HTML command · Validation

checkValidity returns false when any control violates a constraint. reportValidity does the same and shows the browser message.

## Syntax

```html
form.checkValidity() | form.reportValidity()
```

## Example

```html
<!-- Validation runs on submit; reportValidity shows the bubble -->
<form id="booking" action="/book" method="post">
  <label for="customer_email">Email</label>
  <input id="customer_email" name="customer_email" type="email" required>
  <button type="submit">Book</button>
</form>

<script>
  const form = document.querySelector('#booking');

  form.addEventListener('submit', (event) => {
    if (!form.checkValidity()) {
      event.preventDefault();
      form.reportValidity();
    }
  });
</script>
```

## Details

A single control also has `checkValidity()` and `reportValidity()`. The `validity` object exposes flags such as `valueMissing`, `typeMismatch`, `patternMismatch`, `rangeUnderflow`, `rangeOverflow`, `stepMismatch`, `badInput`, and `customError`. Use `setCustomValidity('message')` to add a rule the browser cannot express, and call it again with an empty string to clear the error.
