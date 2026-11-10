# <picture>

HTML command · Links and media

Lets the browser choose an image source based on screen size or format. The img is the fallback.

## Syntax

```html
<picture><source ...><img ...></picture>
```

## Example

```html
<picture>
  <source media="(min-width: 800px)" srcset="wide.jpg">
  <img src="small.jpg" alt="Hotel">
</picture>
```
