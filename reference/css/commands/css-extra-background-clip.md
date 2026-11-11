# background-clip

CSS command · Backgrounds

Limits painting of the background to the text glyphs or to the padding and content boxes. With transparent text it makes gradient text.

## Syntax

```css
background-clip: text;
```

## Example

```css
.headline {
  background-image: linear-gradient(90deg, #1f6feb, #6f42c1);
  /* paint only inside the letters */
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```
