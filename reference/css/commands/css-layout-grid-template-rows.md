# grid-template-rows

CSS command · Grid

Defines the explicit row tracks. Sizes rows, not items, and is often left to content.

## Syntax

```css
grid-template-rows: auto 1fr auto;
```

## Example

```css
.page {
  display: grid;
  grid-template-rows: auto 1fr auto; /* header, scroll area, footer */
  min-height: 100vh;
}

.page__main {
  overflow: auto; /* the 1fr row scrolls instead of stretching the page */
}
```
