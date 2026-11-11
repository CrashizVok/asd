# value attribute and value property

HTML command · Input

The value attribute sets the initial value. The value property is the live text the user typed, and the two drift apart after the first edit.

## Syntax

```html
<input value="2026-11-11"> | input.value = '...'
```

## Example

```html
<label for="start_date">Arrival</label>
<input id="start_date" name="start_date" type="date" value="2026-11-11">

<script>
  const field = document.querySelector('#start_date');

  // Attribute: the default, unchanged by typing
  console.log(field.getAttribute('value')); // 2026-11-11

  // Property: what the form will actually submit
  console.log(field.value);

  // Reset restores the attribute value, not the last typed one
  field.value = '2026-12-01';
</script>
```
