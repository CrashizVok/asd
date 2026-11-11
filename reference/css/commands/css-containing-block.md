# finding the containing block

CSS command · Positioning

An absolute box measures against the padding box of the nearest ancestor whose position is not static, or the initial containing block.

## Syntax

```css
position: absolute;
```

## Example

```css
/* Walk up from the absolute box and stop at the first match. */
.static-parent { position: static; }        /* skip */
.grid-parent { position: relative; }        /* stop here: its padding box wins */

.child {
  position: absolute;
  top: 0;             /* 0 from the padding edge of .grid-parent */
  left: 0;
}

/* Fixed boxes use the viewport unless an ancestor has transform,
   filter, perspective, contain: paint or content-visibility: auto. */
```
