# column-count

CSS command · Layout

Flows content into newspaper style columns. column-width sets a target width and lets the browser choose the count.

## Syntax

```css
column-count: 3; column-gap: 2rem;
```

## Example

```css
.terms {
  /* at most three columns with gaps between them */
  column-count: 3;
  column-gap: 2rem;
}
@media (max-width: 600px) {
  .terms { column-count: 1; }
}
```
