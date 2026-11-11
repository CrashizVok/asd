# aria-labelledby

HTML command · Accessibility attributes

Points at the ids that name the element. It wins over aria-label and over visible text, and it can combine several ids.

## Syntax

```html
aria-labelledby="dialog-title"
```

## Example

```html
<div role="dialog" aria-labelledby="dlg-title" aria-describedby="dlg-body">
  <h2 id="dlg-title">Cancel booking</h2>
  <p id="dlg-body">The room will be released.</p>
</div>
<!-- ids are read left to right, so order the words in the attribute -->
```
