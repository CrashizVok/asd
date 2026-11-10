# Variables

CSS topic · Exam Wiki

```css
:root {
  --brand: #1f6feb;
  --text: #1b1f24;
  --radius: 12px;
  --space: 1rem;
}
.btn { background: var(--brand); border-radius: var(--radius); }
```

Variables cascade and inherit. A child can override one locally. `var(--x, fallback)` supplies a default.
