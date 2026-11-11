# hidden field

HTML command · Input

Sends a fixed value without showing a control. It is visible in the page source and can be edited with devtools.

## Syntax

```html
<input type="hidden" name="hotel_id" value="1">
```

## Example

```html
<form action="/book" method="post">
  <!-- State flag, not a trust boundary -->
  <input type="hidden" name="hotel_id" value="1">
  <input type="hidden" name="step" value="confirm">

  <label for="customer_email">Email</label>
  <input id="customer_email" name="customer_email" type="email" required>
  <button type="submit">Confirm</button>
</form>
```

## Details

Hidden inputs are barred from constraint validation, so `required` on them does nothing. Never put a price, a role, or a permission in a hidden field without checking it again on the server. A CSRF token in a hidden field is fine because the server issued it and verifies it.
