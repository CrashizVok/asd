# oninput

HTML command · Events

Fires after every change to the value, including paste and drag. It is the event for live counters and search previews.

## Syntax

```html
oninput="handler()"
```

## Example

```html
<!-- fires on every keystroke and on paste -->
<textarea id="description" name="description" maxlength="200" oninput="count()"></textarea>
<p id="left">200 characters left</p>

<script>
  function count() {
    const field = document.getElementById('description');
    document.getElementById('left').textContent =
      (200 - field.value.length) + ' characters left';
  }
</script>
```
