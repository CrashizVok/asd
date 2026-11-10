# Borders, margin, padding

CSS topic · Exam Wiki

```css
.card {
  margin: 16px auto;
  padding: 20px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.card > h2 {
  margin: 0 0 8px;
}
```

Margin is space outside the border; padding is space inside. Shorthand `margin: 16px auto` means 16px top and bottom, auto left and right, which centers a fixed-width block. `border-radius` rounds the corners; `box-shadow` adds depth without affecting layout.
