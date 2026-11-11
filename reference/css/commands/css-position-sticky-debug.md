# why sticky does nothing

CSS command · Positioning

Sticky needs a threshold, a taller parent, and no clipping ancestor between it and the scrollport.

## Syntax

```css
.item { position: sticky; top: 0; }
```

## Example

```css
/* 1. The threshold is missing. */
.head { position: sticky; }               /* no top, no stickiness */

/* 2. An ancestor clips it. */
.wrapper { overflow: hidden; }            /* becomes the scrollport */

/* 3. No room to travel. */
.column { display: grid; }                /* stretch makes the child as tall as the parent */
.column > .head { position: sticky; top: 0; }
.column > .head { align-self: start; }    /* gives the element room to move */
```
