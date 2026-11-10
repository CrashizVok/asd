# Overflow and z-index

CSS topic · Exam Wiki

```css
.table-wrap {
  overflow-x: auto;
}

.modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.5);
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 10;
}
```

`overflow-x: auto` adds a horizontal scrollbar only when needed. `z-index` only works on a positioned element or a flex/grid item. A child cannot escape its parent's stacking context, so a high number is not always enough.
