# background-attachment

CSS command · Backgrounds

Keeps a background fixed to the viewport while content scrolls, or lets it scroll with its element. Fixed can hurt scrolling on mobile.

## Syntax

```css
background-attachment: fixed;
```

## Example

```css
.hero {
  background-image: url("img/lobby.jpg");
  background-size: cover;
  /* the image stays put while the page scrolls */
  background-attachment: fixed;
}
```
