# background-blend-mode

CSS command · Backgrounds

Blends the background layers of one element with each other. It is separate from mix-blend-mode, which blends the element with the page.

## Syntax

```css
background-blend-mode: multiply;
```

## Example

```css
.tinted {
  background-image: linear-gradient(#1f6feb, #1f6feb), url("img/room.jpg");
  background-size: cover;
  /* the gradient multiplies into the photo */
  background-blend-mode: multiply;
}
```
