# transform order

CSS command · Transform

Functions compose left to right, so order changes the result. Keep the list identical at both ends of a transition.

## Syntax

```css
transform: translate(...) rotate(...) scale(...);
```

## Example

```css
/* move along the page axis, then spin in place */
.after-translate {
  transform: translateX(100px) rotate(45deg);
}

/* spin first, then move along the rotated axis */
.after-rotate {
  transform: rotate(45deg) translateX(100px);
}

/* both ends share one function list, so interpolation is smooth */
.panel {
  transform: translateY(0) scale(1);
  transition: transform 220ms ease-out;
}

.panel.is-hidden {
  transform: translateY(12px) scale(0.98);
}
```

## Details

Matching function lists interpolate function by function. Mismatched lists are converted to matrices, and the numbers inside the matrix can pass through shapes nobody designed, such as an unintended shrink in the middle of a rotation.
