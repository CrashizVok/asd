# Flexbox

CSS topic · Exam Wiki

One axis at a time. The container decides direction.

```css
.row {
  display: flex;
  gap: 16px;
  justify-content: space-between; /* main axis */
  align-items: center;            /* cross axis */
  flex-wrap: wrap;
}
.row > .item { flex: 1 1 200px; } /* grow shrink basis */
```

`justify-content` works on the main axis, `align-items` on the cross axis. `flex: 1` means grow and shrink equally. `margin-left: auto` on one child pushes it to the far end. Use `gap` instead of margins between items.
