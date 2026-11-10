# Text and fonts

CSS topic · Exam Wiki

```css
body {
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #1f2937;
}

h1 {
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.muted {
  color: #6b7280;
  font-size: 0.875rem;
}
```

`line-height` without a unit scales with the font size. `clamp(min, preferred, max)` makes a fluid heading without a media query. A font stack falls back from left to right.
