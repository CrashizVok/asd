# animation-fill-mode

CSS command · Animation

Controls the style before the delay and after the end. Default none, which is why finished entrances snap back.

## Syntax

```css
animation-fill-mode: none | forwards | backwards | both;
```

## Example

```css
/* hold the first frame during the 120ms delay, keep the last frame after the end */
.enter {
  animation: slide-up 450ms ease-out 120ms 1 normal both;
}

/* final state declared outside the keyframes as a safety net */
.enter {
  opacity: 1;
  transform: translateY(0);
}
```

## Details

`forwards` keeps the last keyframe, `backwards` applies the first keyframe during the delay, `both` does the two jobs. Without `both`, a delayed entrance flashes at its natural style and then jumps into the animation.

In a reduced motion block, `animation: none` also cancels the fill, so the end state must exist in a normal declaration.
