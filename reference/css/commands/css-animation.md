# animation and @keyframes

CSS command · Animation

Runs a keyframe animation. The shorthand sets name, duration, timing, delay, iteration, direction, and fill mode.

## Syntax

```css
animation: fade 0.4s ease both;
```

## Example

```css
@keyframes fade {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.card {
  animation: fade 0.4s ease both;
}
```
