# min, max, and step

HTML command · Validation

Bounds numeric, date, and time values and sets the allowed increment. Numbers default to a step of 1, so decimals need step="0.01" or step="any".

## Syntax

```html
<input type="number" min="1" max="6" step="1">
```

## Example

```html
<!-- step="0.01" is what allows cents -->
<label for="adults">Adults</label>
<input id="adults" name="adults" type="number"
       min="1" max="6" step="1" value="2" required>

<label for="price">Price per night</label>
<input id="price" name="price" type="number"
       min="0" max="999" step="0.01">

<label for="start_date">Arrival</label>
<input id="start_date" name="start_date" type="date"
       min="2026-11-11" max="2027-12-31">
```

## Details

For dates, `step` counts days. For times, it counts seconds, so `step="900"` allows quarter hours. The step grid starts at `min` when it is present, otherwise at the `value` attribute, otherwise at zero. A value off the grid produces a `stepMismatch` validity error.
