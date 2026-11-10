# px, rem, em, %, vw, vh, fr

CSS command · Responsive

px is fixed. rem is relative to root font size. em is relative to the parent. % is relative to the parent. vw/vh are viewport size. fr is a grid fraction.

## Syntax

```css
padding: 1rem; width: 50%; height: 100vh;
```

## Example

```css
.panel {
  width: min(1100px, 92vw);
  padding: 2rem;
  min-height: 100vh;
}

.grid {
  grid-template-columns: 1fr 2fr;
}
```
