# @media (forced-colors: active)

CSS command · Print and accessibility

Applies in Windows high contrast mode, where the system replaces colours. Use system colour keywords and keep borders visible.

## Syntax

```css
@media (forced-colors: active) { ... }
```

## Example

```css
@media (forced-colors: active) {
  .card {
    /* system colours survive the forced palette */
    border: 1px solid CanvasText;
  }
  .card:focus-visible { outline: 2px solid Highlight; }
}
```
