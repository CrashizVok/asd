# Pattern: fixed navbar

CSS topic · Exam Wiki

```css
.navbar {
  position: fixed;
  inset: 0 0 auto 0;   /* top, right, bottom, left */
  height: 64px;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 0 24px;
  background: #10202f;
  color: #fff;
  z-index: 10;
}
body { padding-top: 64px; } /* stop content sliding under it */
```

A fixed bar leaves the flow, so reserve its height on the body. Add `backdrop-filter: blur(8px)` and a transparent background for a glass look.
