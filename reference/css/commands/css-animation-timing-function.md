# animation-timing-function

CSS command · Animation

Sets the easing between keyframes. It applies per segment, not once across the whole animation.

## Syntax

```css
animation-timing-function: ease-out;
```

## Example

```css
@keyframes drop {
  0% {
    transform: translateY(-40px);
    animation-timing-function: ease-in;   /* accelerate down */
  }
  70% {
    transform: translateY(0);
    animation-timing-function: ease-out;  /* settle on landing */
  }
  100% {
    transform: translateY(0);
  }
}

.ball {
  animation: drop 700ms both;
}
```

## Details

Because the function restarts at each keyframe, `ease-in-out` on a three frame animation slows down at every offset. Declaring the function inside a keyframe overrides it from that offset onward, which is how one block gets two different feels.
