# input type="color"

HTML command · Forms

A colour picker that returns a lowercase hex value such as #1f6feb. The picker UI is controlled by the browser.

## Syntax

```html
<input type="color" name="theme">
```

## Example

```html
<label for="theme">Card colour</label>
<input id="theme" type="color" name="theme" value="#1f6feb">
<script>
  // the value is always #rrggbb, never a colour name
  document.getElementById('theme').addEventListener('input', (event) => {
    document.body.style.setProperty('--card', event.target.value);
  });
</script>
```
