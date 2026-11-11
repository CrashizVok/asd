# onfocus and onblur

HTML command · Events

Focus and blur fire when an element gains or loses keyboard focus. Neither bubbles, so use focusin and focusout on a parent.

## Syntax

```html
onfocus="handler()" onblur="handler()"
```

## Example

```html
<input name="phone" onfocus="this.select()" onblur="formatPhone(this)">

<form id="booking">
  <input name="city">
</form>
<script>
  // focusin bubbles from the input up to the form
  document.getElementById('booking').addEventListener('focusin', () => console.log('field entered'));
</script>
```
