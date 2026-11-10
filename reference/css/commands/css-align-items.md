# align-items and align-self

CSS command · Flexbox

Aligns items on the cross axis. align-self overrides it for one item.

## Syntax

```css
align-items: center;
```

## Example

```css
.card-row {
  display: flex;
  align-items: stretch;
}

.card-row .icon {
  align-self: flex-start;
}
```
