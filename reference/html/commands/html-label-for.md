# label for

HTML command · Labels

Pairs visible text with a control by matching id. Clicking the label focuses the input or toggles the checkbox.

## Syntax

```html
<label for="id">Text</label> <input id="id" ...>
```

## Example

```html
<!-- for points at the id, never at the name -->
<label for="first_name">First name</label>
<input id="first_name" name="first_name" type="text" autocomplete="given-name" required>

<label for="terms">I accept the terms</label>
<input id="terms" name="terms" type="checkbox" required>
```
