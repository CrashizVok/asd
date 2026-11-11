# onkeydown

HTML command · Events

Fires when a key goes down while the element has focus. event.key gives the printable name, event.code the physical key.

## Syntax

```html
onkeydown="handler()"
```

## Example

```html
<!-- key names are readable strings: Enter, Escape, ArrowDown -->
<input id="search" type="search" placeholder="City">
<script>
  document.getElementById('search').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') console.log('search now');
    if (event.key === 'Escape') event.target.value = '';
  });
</script>
```
