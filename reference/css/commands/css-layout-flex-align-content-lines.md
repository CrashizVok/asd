# align-content

CSS command · Flexbox

Distributes space between wrapped lines on the cross axis. It is ignored when the container has a single line.

## Syntax

```css
align-content: stretch | flex-start | center | space-between | space-around | space-evenly
```

## Example

```css
.tags {
  display: flex;
  flex-wrap: wrap;      /* required, otherwise align-content does nothing */
  align-content: center; /* centres the block of lines vertically */
  min-height: 200px;
  gap: 8px;
}
```
