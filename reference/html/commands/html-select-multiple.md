# select multiple

HTML command · Choice

Allows several selected options. Each selection becomes its own name and value pair in the submission.

## Syntax

```html
<select name="extras" multiple size="4">
```

## Example

```html
<!-- One pair per selected option in the submission -->
<label for="extras">Extras</label>
<select id="extras" name="extras" multiple size="4">
  <option value="breakfast">Breakfast</option>
  <option value="parking">Parking</option>
  <option value="spa">Spa access</option>
  <option value="late">Late checkout</option>
</select>
```

## Details

A multiple select usually renders as a list box rather than a dropdown, and `size` sets how many rows are visible. Selecting nothing sends no key at all, and some users do not know that Ctrl or Cmd is needed for multiple picks. A list of checkboxes with the same name is often the friendlier choice.
