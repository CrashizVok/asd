# onclick

HTML command · Events

Runs a script when the element is clicked. Inline handlers are quick for demos, addEventListener keeps behaviour out of the markup.

## Syntax

```html
onclick="handler()"
```

## Example

```html
<button onclick="alert('Room held for 10 minutes')">Hold room</button>

<!-- the same behaviour, wired from script -->
<button id="hold">Hold room</button>
<script>
  document.getElementById('hold').addEventListener('click', () => {
    alert('Room held for 10 minutes');
  });
</script>
```
