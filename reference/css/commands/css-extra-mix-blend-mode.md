# mix-blend-mode

CSS command · Effects

Blends an element with what is painted under it. It works on the element as a whole, not on single colours.

## Syntax

```css
mix-blend-mode: multiply;
```

## Example

```css
.overlay-title {
  /* dark text over a photo, blended with the pixels below */
  mix-blend-mode: multiply;
}
.hero::after {
  background: linear-gradient(90deg, #000, transparent);
  mix-blend-mode: screen;
}
```
