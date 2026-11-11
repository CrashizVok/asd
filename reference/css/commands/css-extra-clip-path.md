# clip-path

CSS command · Effects

Cuts the painted shape to a polygon, circle, ellipse or path. The element keeps its layout box, only the visible part changes.

## Syntax

```css
clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
```

## Example

```css
.angled {
  /* the box still occupies the full rectangle */
  clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
}
.avatar { clip-path: circle(50%); }
```

## Details

A clipped element still receives pointer events only inside the visible shape, but a focus ring drawn outside the cut disappears. Keep focusable controls away from the clipped edge or draw the ring inside.

clip-path on a parent also clips positioned children, including dropdowns that open outside the box.
