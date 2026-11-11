# hidden

HTML command · Global attributes

Removes the element from rendering and from the accessibility tree. It is a boolean attribute, the same effect as display: none without writing CSS.

## Syntax

```html
<div hidden>
```

## Example

```html
<p id="error" hidden>Check the dates.</p>

<script>
  // show the message when validation fails
  document.getElementById('error').hidden = false;
</script>
<!-- hidden does not stop images from loading or scripts from running -->
```
