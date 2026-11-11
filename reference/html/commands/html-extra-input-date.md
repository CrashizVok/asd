# input type="date"

HTML command · Forms

A date picker whose value is always YYYY-MM-DD. min and max restrict the range and the browser blocks out of range submits.

## Syntax

```html
<input type="date" name="start_date">
```

## Example

```html
<label for="start_date">Arrival</label>
<input id="start_date" type="date" name="start_date"
       value="2026-07-01" min="2026-01-01" max="2027-12-31" required>
<!-- the wire format stays YYYY-MM-DD even when the display is local -->
```
