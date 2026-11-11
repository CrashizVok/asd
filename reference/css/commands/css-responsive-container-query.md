# @container

CSS command · Responsive layout

Styles a component by the width of its container, so the same card works in a sidebar and in a wide grid.

## Syntax

```css
.card-wrap { container-type: inline-size; }
@container (min-width: 400px) { ... }
```

## Example

```css
.card-wrap {
  container-type: inline-size;  /* makes this box a query container */
  container-name: card;
}

.card {
  display: grid;
  gap: 8px;
}

@container card (min-width: 400px) {
  .card {
    /* Side by side only when the card itself is wide enough. */
    grid-template-columns: 120px 1fr;
    align-items: center;
  }
}
```
