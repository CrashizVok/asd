# flex-shrink

CSS command · Flex items

How much an item gives up when items overflow. Default 1 shrinks, 0 locks the size.

## Syntax

```css
flex-shrink: 1;
```

## Example

```css
.field-row {
  display: flex;
  gap: 8px;
}

.field-row__input {
  flex: 1 1 auto;
  min-width: 0;   /* allows shrinking below the longest word */
}

.field-row__button {
  flex-shrink: 0; /* the button keeps its padding and label */
}
```
