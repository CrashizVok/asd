# Units and functions

CSS topic · Exam Wiki

```css
.panel {
  width: min(1100px, 100% - 32px);
  min-height: 100vh;
  padding: clamp(16px, 3vw, 32px);
  font-size: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}
```

`rem` is relative to the root font size, `em` to the current element, `vh` and `vw` to the viewport. `min()`, `max()`, and `clamp()` choose a value at runtime. `auto-fill` and `minmax()` make a responsive grid without media queries.
