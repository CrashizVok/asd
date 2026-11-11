# required

HTML command · Validation

Blocks submission while the control is empty. On a radio group, one member carrying it makes the whole group mandatory.

## Syntax

```html
<input type="email" name="customer_email" required>
```

## Example

```html
<!-- One required member makes the whole radio group mandatory -->
<label for="customer_email">Email</label>
<input id="customer_email" name="customer_email" type="email" required>

<fieldset>
  <legend>Room</legend>
  <label><input type="radio" name="room" value="single" required> Single</label>
  <label><input type="radio" name="room" value="double"> Double</label>
</fieldset>
```

## Details

`required` is ignored on `type="hidden"`, because hidden controls are barred from constraint validation. It has no practical effect on `range` and `color`, which always carry a value. The browser can enforce it only until the user opens devtools, so the server repeats every check.
