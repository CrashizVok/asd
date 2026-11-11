# display: grid

CSS command · Grid

Turns an element into a grid container. Direct children become grid items placed in cells.

## Syntax

```css
.container { display: grid; }
```

## Example

```css
.layout {
  display: grid; /* one column by default, items stack */
  gap: 16px;
}

.layout > * {
  /* each direct child occupies one cell in source order */
}
```
