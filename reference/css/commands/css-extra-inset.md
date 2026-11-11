# inset

CSS command · Positioning

Shorthand for top, right, bottom and left. inset 0 stretches an absolutely positioned element over its containing block.

## Syntax

```css
inset: 0;
```

## Example

```css
.overlay {
  position: absolute;
  /* top right bottom left, all zero */
  inset: 0;
}
.tooltip {
  position: absolute;
  inset: auto auto -0.5rem 50%; /* only bottom and left set */
}
```
