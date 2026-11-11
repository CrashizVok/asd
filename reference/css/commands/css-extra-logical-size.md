# inline-size and block-size

CSS command · Layout

Logical width and height that follow writing mode. inline-size is width in a normal left to right document, block-size is height.

## Syntax

```css
inline-size: 20rem; block-size: auto;
```

## Example

```css
.card {
  /* width and height that still work in vertical writing mode */
  inline-size: 20rem;
  block-size: auto;
}
.vertical {
  writing-mode: vertical-rl;
  inline-size: 60vh; /* now the vertical extent */
}
```
