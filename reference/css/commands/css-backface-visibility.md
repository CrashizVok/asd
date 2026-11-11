# backface-visibility

CSS command · 3D

Hides the side of an element that faces away from the viewer, which makes two faced cards work.

## Syntax

```css
backface-visibility: hidden;
```

## Example

```css
.flip__face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
}

/* the back starts turned around */
.flip__face--back {
  transform: rotateY(180deg);
  background-color: #24518f;
  color: #ffffff;
}
```

## Details

Without it, the front face stays visible through the back after a half turn, so the user reads mirrored text instead of the back content. Older Safari needs the prefixed `-webkit-backface-visibility` beside it.
