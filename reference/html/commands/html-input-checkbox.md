# checkbox

HTML command · Choice

An independent on or off control. Checked boxes submit their value, and boxes sharing a name produce repeated keys.

## Syntax

```html
<input type="checkbox" name="extras" value="breakfast" checked>
```

## Example

```html
<label><input type="checkbox" name="extras" value="breakfast" checked> Breakfast</label>
<label><input type="checkbox" name="extras" value="parking"> Parking</label>

<!-- Consent: required means must be ticked -->
<label>
  <input type="checkbox" name="terms" value="accepted" required>
  I accept the house rules
</label>
```

## Details

A checkbox with no `value` submits `on` when ticked. An unchecked box submits nothing at all, so the server has to treat a missing key as false. `required` on a checkbox means it must be checked before the form can submit.
