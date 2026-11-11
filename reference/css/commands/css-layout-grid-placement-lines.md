# grid-column and grid-row

CSS command · Grid items

Places an item by line number or by a span. Negative lines count from the end of the grid.

## Syntax

```css
grid-column: 1 / -1;  grid-row: span 2;
```

## Example

```css
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.grid__banner {
  grid-column: 1 / -1; /* full width whatever the column count */
}

.grid__wide {
  grid-column: span 2; /* two cells from wherever it lands */
  grid-row: 2;         /* second row, one cell tall */
}
```

## Details

The `/` form is start then end. In a four column grid the lines are 1 to 5, so `grid-column: 2 / 4` covers two columns. `-1` is the last line, which makes `1 / -1` the full row and saves you from updating numbers after a track change.
