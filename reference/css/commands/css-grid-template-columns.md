# grid-template-columns

CSS command · Grid

Defines the column track sizes. repeat and minmax make a responsive card grid without media queries.

## Syntax

```css
grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
```

## Example

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}
```
