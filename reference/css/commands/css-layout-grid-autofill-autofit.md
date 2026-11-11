# auto-fill and auto-fit

CSS command · Grid

auto-fill keeps empty tracks, auto-fit collapses them so the remaining items stretch to fill the row.

## Syntax

```css
repeat(auto-fit, minmax(240px, 1fr));
```

## Example

```css
/* stretches: one item fills the whole row */
.stretch {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

/* keeps card sized slots, empty space stays at the right */
.fixed-slots {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
```
