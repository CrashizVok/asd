# justify-self

CSS command · Grid

Aligns one grid item along the inline axis, inside its own grid area. Flex items ignore it.

## Syntax

```css
justify-self: center;
```

## Example

```css
.cell {
  display: grid;
  grid-template-columns: 1fr;
}
.cell > button {
  /* horizontal placement inside the cell */
  justify-self: end;
}
/* in flexbox use margin-inline or justify-content instead */
```
