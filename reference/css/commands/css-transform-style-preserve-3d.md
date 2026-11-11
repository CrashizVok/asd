# transform-style

CSS command · 3D

Keeps children in the parent's 3D space instead of flattening them onto its plane.

## Syntax

```css
transform-style: preserve-3d;
```

## Example

```css
.flip {
  perspective: 1000px;
}

.flip__inner {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 500ms ease;
}

.flip:hover .flip__inner {
  transform: rotateY(180deg);
}

/* without preserve-3d the two faces land on one plane */
```

## Details

The default is `flat`, which projects every child onto the parent's plane. A card flip built from two absolutely positioned faces then shows only one of them, usually the front, mirrored.

Some properties force flattening even when `preserve-3d` is set: `overflow` other than visible, `filter`, `opacity` below 1 and `clip-path` all create a grouping context. Moving `overflow: hidden` off the flip wrapper is often the fix.
