# mobile first layout

CSS command · Breakpoints

Base styles describe the narrow screen and min-width queries add columns as space appears.

## Syntax

```css
.grid { grid-template-columns: 1fr; }
@media (min-width: 48em) { .grid { grid-template-columns: repeat(2, 1fr); } }
```

## Example

```css
/* Phone layout first, no query needed. */
.grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}

@media (min-width: 48em) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 64em) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}
```
