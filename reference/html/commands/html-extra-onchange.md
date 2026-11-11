# onchange

HTML command · Events

Fires when a value is committed: on blur for text fields, immediately for selects, checkboxes and date pickers.

## Syntax

```html
onchange="handler()"
```

## Example

```html
<select name="stars" onchange="this.form.submit()">
  <option value="">Any</option>
  <option value="4">4 stars</option>
</select>

<!-- a text field fires change after focus leaves it -->
<input type="text" name="city" onchange="console.log(this.value)">
```

## Details

Use input instead when you need every keystroke, for example a character counter or a live filter. change is the event for finished values.
