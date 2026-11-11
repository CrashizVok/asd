# source type

HTML command · Media

The type attribute lets the browser skip formats it cannot play before downloading. The first source that matches is used.

## Syntax

```html
<source src="clip.webm" type="video/webm">
```

## Example

```html
<video controls>
  <!-- order matters: the first supported source wins -->
  <source src="clip.webm" type="video/webm">
  <source src="clip.mp4" type="video/mp4">
</video>

<picture>
  <source srcset="hero.avif" type="image/avif">
  <img src="hero.jpg" alt="Hotel lobby">
</picture>
```
