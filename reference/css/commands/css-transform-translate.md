# translate()

CSS command · Transform

Moves the painted box without touching layout. Percentages resolve against the element's own size.

## Syntax

```css
transform: translate(x, y); | translateX(x); | translateY(y);
```

## Example

```css
/* centre a tooltip that was placed with left: 50% */
.tooltip {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 8px);
  transform: translate(-50%, 4px);
}

.lift {
  transform: translateY(-6px);
}
```

## Details

`translateX(-50%)` shifts by half the element's own width, which works at any width, unlike a fixed negative margin. A single argument to `translate` sets x only; y stays at 0.

Translation is independent of `transform-origin`, unlike rotate, scale and skew.
