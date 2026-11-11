# accesskey

HTML command · Global attributes

Assigns a keyboard shortcut, triggered with Alt or Ctrl depending on the platform. Conflicts with browser and screen reader keys make it unreliable.

## Syntax

```html
accesskey="s"
```

## Example

```html
<button accesskey="s" onclick="document.forms[0].submit()">Save (Alt+S)</button>
<!-- print the hint in the label, users cannot discover the key otherwise -->
```
