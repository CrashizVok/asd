# absolute stretch with inset

CSS command · Positioning

Removes the box from flow and stretches it to its containing block when width and height stay auto.

## Syntax

```css
.overlay { position: absolute; inset: 0; }
```

## Example

```css
.figure {
  position: relative;
}

.figure__cover {
  position: absolute;
  inset: 0;            /* top right bottom left all zero */
  background: rgb(12 18 28 / 45%);
}
```
