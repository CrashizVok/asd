# will-change

CSS command · Motion

Hints that a property is about to change, so the browser can promote the element ahead of time.

## Syntax

```css
will-change: transform, opacity;
```

## Example

```css
/* one element, one hint, only while it is about to move */
.drawer {
  will-change: transform;
  transition: transform 260ms ease-out;
}

/* remove the hint once the movement is over */
.drawer.is-settled {
  will-change: auto;
}
```

## Details

Use it on the element that actually animates, not on every card in a grid. Permanent promotion of many elements costs GPU memory, and on a phone that cost shows up as jank elsewhere. Most transitions and animations run fine without it: modern engines promote elements that are already animating.
