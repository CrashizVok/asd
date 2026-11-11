# fieldset disabled

HTML command · Forms

Disables every control inside the fieldset at once. Disabled controls are skipped in the submit and cannot be focused.

## Syntax

```html
<fieldset disabled>
```

## Example

```html
<form action="/bookings" method="post">
  <fieldset disabled>
    <!-- the whole group is locked until payment is confirmed -->
    <input name="room" value="101">
    <button>Confirm</button>
  </fieldset>
</form>
<script>
  document.querySelector('fieldset').disabled = false;
</script>
```
