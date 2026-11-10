# <dialog>

HTML command · Interactive

A native popup or modal dialog. Use showModal() and close() from JavaScript.

## Syntax

```html
<dialog id="box">...</dialog>
```

## Example

```html
<dialog id="owner">
  <h2>Owner</h2>
  <button onclick="owner.close()">Close</button>
</dialog>
<script>owner.showModal();</script>
```
