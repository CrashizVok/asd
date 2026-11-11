# multiple background layers

CSS command · Backgrounds

Comma separated layers paint front to back: the first layer is on top. Each layer can set its own position and size.

## Syntax

```css
background: url(dots.svg) repeat, linear-gradient(#fff, #eef2f7);
```

## Example

```css
.pattern {
  background:
    url("img/dots.svg") repeat,             /* top layer */
    linear-gradient(180deg, #fff, #eef2f7); /* bottom layer */
  background-size: 24px, cover;
}
```
