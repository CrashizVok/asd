# wrapping label

HTML command · Labels

Wraps the control instead of using for and id. No id is needed, and the whole label area becomes clickable.

## Syntax

```html
<label>Text <input ...></label>
```

## Example

```html
<!-- One labelable control per wrapping label -->
<label>
  Breakfast included
  <input type="checkbox" name="extras" value="breakfast">
</label>

<label>
  Email
  <input name="customer_email" type="email" required>
</label>
```

## Details

A wrapping label may contain only one labelable control. It is the shorter option for checkboxes and radios, where each option needs its own label. For text inputs the `for` form is easier to style, because the text and the input are separate boxes.
