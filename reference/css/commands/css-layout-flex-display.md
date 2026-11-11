# display: flex

CSS command · Flexbox

Turns an element into a flex container. Its direct children become flex items on one axis.

## Syntax

```css
.container { display: flex; }
```

## Example

```css
.toolbar {
  display: flex;      /* children flow left to right */
  align-items: center; /* one centre line for all of them */
  gap: 16px;
}

.toolbar > * {
  /* every direct child is a flex item now */
}
```

## Details

Only direct children become items. A grandchild keeps its own display type, so a nav inside a flex header needs `display: flex` of its own before its links behave as items.

Use `inline-flex` when the container should shrink to its content and sit inside a line of text.
