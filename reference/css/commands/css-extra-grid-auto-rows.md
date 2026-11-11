# grid-auto-rows

CSS command · Grid

Sizes rows created by the implicit grid, meaning rows no template declared. Useful when items are added without a known count.

## Syntax

```css
grid-auto-rows: minmax(120px, auto);
```

## Example

```css
.list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  /* each extra row is at least 120px and grows with content */
  grid-auto-rows: minmax(120px, auto);
  gap: 1rem;
}
```
