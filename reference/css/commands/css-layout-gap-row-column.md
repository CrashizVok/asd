# gap

CSS command · Shared

Sets the space between flex or grid items. Two values mean row gap then column gap.

## Syntax

```css
gap: 16px;  gap: 12px 24px;
```

## Example

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px 24px; /* 12px between rows, 24px between columns */
}

.flex-row {
  display: flex;
  gap: 16px; /* replaces margins between items */
}
```
