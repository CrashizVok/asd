# text-overflow

CSS command · Typography

Adds an ellipsis when text overflows its box. It only works with overflow hidden or clip and white-space nowrap on a single line.

## Syntax

```css
text-overflow: ellipsis;
```

## Example

```css
.cell-name {
  /* all three are needed, or no ellipsis appears */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 12rem;
}
```
