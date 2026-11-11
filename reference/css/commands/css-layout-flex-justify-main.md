# justify-content

CSS command · Flexbox

Distributes free space along the main axis. It does nothing when the items already fill that axis.

## Syntax

```css
justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly
```

## Example

```css
.row {
  display: flex;
  justify-content: space-between; /* first at start, last at end */
  align-items: center;
}

/* One item to the far end, without justify-content: */
.row__action {
  margin-left: auto;
}
```

## Details

The values are easy to mix up:

- `space-between` puts no space at the edges.
- `space-around` gives each item half a gap at the edges.
- `space-evenly` gives one equal gap everywhere, edges included.

With `flex-direction: column` this property controls vertical placement, and it needs a height or `min-height` on the container to have space to distribute.
