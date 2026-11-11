# aria-hidden

HTML command · Accessibility attributes

Removes an element from the accessibility tree while keeping it visible. Use it for decorative images and icons that sit next to a text label.

## Syntax

```html
aria-hidden="true"
```

## Example

```html
<!-- the icon repeats the text, so hide it from screen readers -->
<button>
  <span aria-hidden="true">*</span> Favourite
</button>

<!-- never on a focusable element: it stays reachable but has no name -->
```
