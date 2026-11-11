# select and option

HTML command · Choice

A dropdown of options. The submitted value comes from the option's value attribute, or from its text when value is missing.

## Syntax

```html
<select name="hotel_id"><option value="1">Name</option></select>
```

## Example

```html
<!-- Empty value: forces a real choice, pairs with required -->
<label for="hotel_id">Hotel</label>
<select id="hotel_id" name="hotel_id" required>
  <option value="">Choose a hotel</option>
  <optgroup label="City centre">
    <option value="1">Grand Hotel</option>
    <option value="2">Riverside Inn</option>
  </optgroup>
  <optgroup label="Suburbs">
    <option value="3" selected>Park Lodge</option>
  </optgroup>
</select>
```

## Details

An option without a `value` submits its text content, which breaks when the page is translated. Add an empty first option with `value=""` when the user must make a conscious choice, and keep `required` on the select. `optgroup` groups options visually and for assistive tech, and cannot be selected itself.
