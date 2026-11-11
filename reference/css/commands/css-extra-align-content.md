# align-content

CSS command · Flex and grid alignment

Spreads the tracks of a multi line flex or grid container along the cross axis. It does nothing when the tracks already fill the container.

## Syntax

```css
align-content: space-between;
```

## Example

```css
.page {
  display: flex;
  flex-wrap: wrap;
  min-height: 100vh;
  /* pushes the wrapped rows to the top and bottom edges */
  align-content: space-between;
}
```
