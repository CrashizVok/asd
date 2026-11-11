# scale()

CSS command · Transform

Multiplies the size around the transform origin. Values are unitless factors.

## Syntax

```css
transform: scale(sx, sy); | scaleX(n); | scaleY(n);
```

## Example

```css
/* zoom inside a clipped frame */
.frame {
  overflow: hidden;
}

.frame img {
  display: block;
  transition: transform 400ms ease-out;
}

.frame:hover img {
  transform: scale(1.06);
}

/* press feedback */
.key:active {
  transform: scale(0.98);
}
```

## Details

Scaling does not reflow, so the element keeps its original slot in the flow and can overlap neighbours. It also does not re-lay out text: a large factor stretches the painted glyphs and they look soft. Keep UI scaling small and animate font size instead when text must genuinely grow.
