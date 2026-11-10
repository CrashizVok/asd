# z-index

CSS command · Layout

Sets the stacking order of positioned elements. A higher number is closer to the viewer.

## Syntax

```css
z-index: 10;
```

## Example

```css
.navbar {
  position: sticky;
  top: 0;
  z-index: 20;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
}
```
