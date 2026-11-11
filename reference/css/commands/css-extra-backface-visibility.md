# backface-visibility

CSS command · Transforms

Hides the reverse side of a rotated element. Two stacked faces with this property make the classic card flip.

## Syntax

```css
backface-visibility: hidden;
```

## Example

```css
/* the back face stays invisible until rotated */
.face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
}
.back { transform: rotateY(180deg); }
```
