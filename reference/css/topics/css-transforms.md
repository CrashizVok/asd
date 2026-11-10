# Transforms

CSS topic · Exam Wiki

```css
.zoom:hover  { transform: scale(1.05); }
.tilt        { transform: rotate(-3deg); }
.lift        { transform: translateY(-4px); }
.card        { transition: transform 0.2s ease; }
```

Transforms do not affect layout, so they are cheap to animate. Combine them in one declaration: `transform: translateY(-4px) scale(1.02)`. Use `transform-origin` to move the pivot.
