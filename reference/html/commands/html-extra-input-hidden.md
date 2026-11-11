# input type="hidden"

HTML command · Forms

Sends a value the user does not see and cannot edit in the UI. It stays visible in the page source, so never store a secret or a trusted price there.

## Syntax

```html
<input type="hidden" name="hotel_id" value="42">
```

## Example

```html
<form action="/bookings" method="post">
  <input type="hidden" name="hotel_id" value="42">
  <input type="hidden" name="start_date" value="2026-07-01">
  <button>Book</button>
</form>
<!-- the server must re-check hotel_id and the price -->
```
