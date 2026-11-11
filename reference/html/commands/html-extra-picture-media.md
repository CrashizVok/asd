# picture media

HTML command · Media

Chooses an image by viewport or format. The img inside is required and supplies the fallback, the alt text and the layout size.

## Syntax

```html
<picture><source media="(min-width: 800px)" srcset="wide.jpg"><img src="small.jpg" alt=""></picture>
```

## Example

```html
<picture>
  <!-- art direction: a different crop on wide screens -->
  <source media="(min-width: 800px)" srcset="img/room-wide.jpg">
  <source media="(min-width: 400px)" srcset="img/room-mid.jpg">
  <img src="img/room-small.jpg" alt="Room with a city view" width="400" height="300">
</picture>
```
