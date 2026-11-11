# @font-face

CSS command · Typography

Loads a custom font file and gives it a family name. Each weight and style needs its own block.

## Syntax

```css
@font-face { font-family: "Name"; src: url(file.woff2) format("woff2"); }
```

## Example

```css
@font-face {
  font-family: "Brand Sans";
  src: url("fonts/brand-sans.woff2") format("woff2");
  font-weight: 400 700;   /* range for a variable font */
  font-display: swap;     /* show fallback text first */
}

body {
  font-family: "Brand Sans", system-ui, sans-serif;
}
```
