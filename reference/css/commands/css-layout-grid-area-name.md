# grid-area

CSS command · Grid items

Attaches an item to a named area, or places it with four line values in row start, column start, row end, column end order.

## Syntax

```css
grid-area: header;  grid-area: 2 / 1 / 3 / 3;
```

## Example

```css
.panel {
  grid-area: 2 / 1 / 3 / 3; /* row 2 to 3, columns 1 to 3 */
}

.card--featured {
  grid-area: feature; /* matches grid-template-areas */
}
```
