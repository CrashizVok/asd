# border-image

CSS command · Borders

Paints a border from an image or gradient, sliced into nine regions. The number after the source is the slice.

## Syntax

```css
border-image: linear-gradient(135deg, #1f6feb, #6f42c1) 1;
```

## Example

```css
.frame {
  border: 10px solid transparent;
  /* slice 1 stretches the gradient across the border */
  border-image: linear-gradient(135deg, #1f6feb, #6f42c1) 1;
}
```
