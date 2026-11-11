# grid-auto-flow

CSS command · Grid

Controls how auto placed items fill the grid. dense backfills holes left by spanning items.

## Syntax

```css
grid-auto-flow: row dense;
```

## Example

```css
.news {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 120px;
  grid-auto-flow: row dense;
  gap: 16px;
}

.news__feature {
  grid-column: span 2;
  grid-row: span 2; /* leaves a hole that dense fills with later items */
}
```
