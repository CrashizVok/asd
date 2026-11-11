# rotate()

CSS command · Transform

Rotates the box clockwise around the transform origin. Accepts deg, rad, grad and turn.

## Syntax

```css
transform: rotate(45deg);
```

## Example

```css
/* a chevron built from two borders */
.chevron {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(45deg);
  transition: transform 160ms ease;
}

[aria-expanded="true"] .chevron {
  transform: rotate(-135deg);
}
```

## Details

The origin defaults to the centre, so a square rotated by 45 degrees becomes a diamond with even gaps. `rotate(1turn)` and `rotate(360deg)` are the same angle.

Rotating an element that also holds a tooltip moves the tooltip with it, because the whole box is transformed.
