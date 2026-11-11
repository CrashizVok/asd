# will-change

CSS command · Effects

Hints which properties will animate so the browser can prepare layers early. On many elements it costs memory and slows the page.

## Syntax

```css
will-change: transform, opacity;
```

## Example

```css
.dragging {
  /* set only while the interaction is likely */
  will-change: transform;
}
/* remove it when the drag ends, it is not a permanent optimisation */
```
