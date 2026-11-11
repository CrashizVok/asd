# flex-wrap

CSS command · Flexbox

Allows items to move to a new line when the main axis is full. The default nowrap shrinks items instead.

## Syntax

```css
flex-wrap: nowrap | wrap | wrap-reverse
```

## Example

```css
.chips {
  display: flex;
  flex-wrap: wrap;   /* items drop to a second line instead of shrinking */
  gap: 8px;
}

.chip {
  flex: 0 0 auto;    /* a chip keeps its label width */
  padding: 4px 10px;
}
```

## Details

Wrapping creates lines. Each line is sized and aligned on its own, which is why `justify-content: space-between` leaves a lone item on the last line at the start. `align-content` only has an effect once there is more than one line.
