# novalidate

HTML command · Forms

Turns off the browser built in checks so your script can validate and show its own messages.

## Syntax

```html
<form novalidate>
```

## Example

```html
<form action="/bookings" method="post" novalidate>
  <input type="email" name="customer_email" required>
  <button>Book</button>
</form>
<script>
  // checkValidity still works with novalidate
  document.querySelector('form').addEventListener('submit', (event) => {
    if (!event.target.checkValidity()) {
      event.preventDefault();
      console.log('show custom errors');
    }
  });
</script>
```
