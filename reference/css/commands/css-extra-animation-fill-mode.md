# animation-fill-mode

CSS command · Transitions

Keeps the values of the first or last keyframe outside the animation. Without it the element snaps back to its own styles.

## Syntax

```css
animation-fill-mode: forwards;
```

## Example

```css
.toast {
  /* backwards applies the from state during the delay */
  animation: slide-up 240ms ease-out 200ms backwards;
}
.stays {
  animation-fill-mode: forwards; /* last frame held */
}
```
