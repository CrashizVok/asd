# transition-delay

CSS command · Transition

Waits before the interpolation starts. A negative value starts partway through the curve.

## Syntax

```css
transition-delay: 120ms;
```

## Example

```css
.tooltip {
  opacity: 0;
  transition: opacity 140ms ease;
}

/* entering waits a moment, leaving is immediate */
.trigger:hover .tooltip {
  opacity: 1;
  transition-delay: 150ms;
}

/* -100ms of a 400ms transition begins a quarter of the way in */
.warm-start {
  transition: transform 400ms ease -100ms;
}
```
