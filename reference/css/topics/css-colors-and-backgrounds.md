# Colors and backgrounds

CSS topic · Exam Wiki

```css
:root {
  --brand: #2563eb;
  --ink: #1f2937;
  --paper: #ffffff;
}

.hero {
  color: var(--ink);
  background-color: var(--paper);
  background-image: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url("hero.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
```

Use hex for a fixed colour, `rgb()` or `hsl()` when you need transparency or a hue. A gradient layer over an image keeps text readable. `background-size: cover` fills the box and may crop.
