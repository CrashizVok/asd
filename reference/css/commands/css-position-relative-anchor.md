# relative as a containing block

CSS command · Positioning

Keeps the box in flow and makes it the containing block for absolute children. With no offsets it looks unchanged.

## Syntax

```css
.card { position: relative; }
```

## Example

```css
.card {
  position: relative;  /* the badge now measures against this box */
}

.card__tag {
  position: absolute;
  top: 8px;
  right: 8px;
}
```

## Details

Use `relative` with no offsets when the only goal is to anchor a child. Adding `top: 2px` also shifts the painted box and can hide a border, so keep the two jobs separate.
