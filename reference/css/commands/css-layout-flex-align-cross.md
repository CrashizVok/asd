# align-items

CSS command · Flexbox

Aligns items on the cross axis inside their line. The default stretch makes items as tall as the line.

## Syntax

```css
align-items: stretch | flex-start | flex-end | center | baseline
```

## Example

```css
.media {
  display: flex;
  align-items: flex-start; /* stop the image from stretching to text height */
  gap: 12px;
}

.media__img {
  flex: none;   /* the picture keeps its size */
  width: 64px;
  height: 64px;
  object-fit: cover;
}
```
