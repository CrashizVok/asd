# Position

CSS topic · Exam Wiki

```css
.static   { position: static; }   /* default */
.relative { position: relative; top: 8px; left: 8px; }
.absolute { position: absolute; top: 0; right: 0; }
.fixed    { position: fixed; top: 0; left: 0; }
.sticky   { position: sticky; top: 0; }
```

`absolute` positions against the nearest ancestor that is not `static`. That ancestor is usually `position: relative`. `fixed` pins to the viewport and does not scroll. `sticky` switches between normal flow and fixed at a scroll threshold. Positioned elements can use `z-index`; a higher value paints on top.
