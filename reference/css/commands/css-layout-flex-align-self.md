# align-self

CSS command · Flex items

Overrides the container's align-items for a single item.

## Syntax

```css
align-self: auto | stretch | flex-start | flex-end | center | baseline;
```

## Example

```css
.cards {
  display: flex;
  align-items: stretch; /* cards share the tallest height */
}

.cards__note {
  align-self: flex-start; /* this one stays at its own height */
  background: #fffbe6;
}
```
