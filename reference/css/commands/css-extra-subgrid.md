# subgrid

CSS command · Grid

Makes a grid item inherit the track lines of its parent grid. Nested content then aligns to the outer columns without repeating sizes.

## Syntax

```css
grid-template-columns: subgrid;
```

## Example

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.card {
  grid-column: span 2;
  display: grid;
  /* the card uses the two outer column lines */
  grid-template-columns: subgrid;
}
```
