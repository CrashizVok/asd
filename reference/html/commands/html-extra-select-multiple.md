# select multiple

HTML command · Forms

multiple allows more than one option, size sets how many rows are visible. Without size the control collapses to a one line list box.

## Syntax

```html
<select name="extras" multiple size="4">
```

## Example

```html
<label for="extras">Extras</label>
<select id="extras" name="extras" multiple size="4">
  <option value="breakfast">Breakfast</option>
  <option value="parking" selected>Parking</option>
  <option value="spa">Spa</option>
</select>
<!-- a multiple select sends every selected value under the same name -->
```
