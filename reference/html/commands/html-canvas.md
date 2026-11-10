# <canvas>

HTML command · Links and media

A drawing surface for JavaScript. You draw with the 2D or WebGL context.

## Syntax

```html
<canvas id="draw" width="400" height="200"></canvas>
```

## Example

```html
<canvas id="draw" width="400" height="200"></canvas>
<script>
  const ctx = document.getElementById("draw").getContext("2d");
  ctx.fillRect(10, 10, 80, 40);
</script>
```
