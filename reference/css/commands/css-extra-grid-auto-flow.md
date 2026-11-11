# grid-auto-flow

CSS command · Grid

Controls how automatically placed items fill the grid. dense backfills holes left by larger items, which changes the visual order.

## Syntax

```css
grid-auto-flow: row dense;
```

## Example

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* fill rows, and let later items fill gaps */
  grid-auto-flow: row dense;
}
.gallery .wide { grid-column: span 2; }
```

## Details

dense reorders only the paint position. Focus order stays in the DOM, so a keyboard user can move in a different sequence than the eye follows. Use it for image walls, not for forms.
