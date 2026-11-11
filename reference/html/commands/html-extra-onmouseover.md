# onmouseover

HTML command · Events

Fires when the pointer enters the element or one of its children. mouseenter fires once per element and ignores children.

## Syntax

```html
onmouseover="handler()"
```

## Example

```html
<li class="row" onmouseover="this.classList.add('hot')" onmouseout="this.classList.remove('hot')">
  Room 101
</li>

<script>
  // mouseenter avoids repeated firing over child spans
  document.querySelector('.row').addEventListener('mouseenter', () => console.log('in'));
</script>
```
