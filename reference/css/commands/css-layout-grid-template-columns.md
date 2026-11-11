# grid-template-columns

CSS command · Grid

Defines the column tracks: fixed lengths, fractions of free space, or a repeat pattern.

## Syntax

```css
grid-template-columns: 220px 1fr;
```

## Example

```css
.layout {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr); /* sidebar plus fluid main */
  gap: 24px;
}

/* fr shares what is left after fixed tracks and gaps */
.halves {
  display: grid;
  grid-template-columns: 1fr 2fr; /* one third, two thirds */
}
```
