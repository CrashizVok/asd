# @keyframes

CSS command · Transitions

Defines named animation steps that animation-name runs. from and to are 0% and 100%, and intermediate percentages are allowed.

## Syntax

```css
@keyframes name { from { ... } to { ... } }
```

## Example

```css
/* 240ms rise, 12px travel, played once */
@keyframes slide-up {
  from { transform: translateY(12px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

.toast {
  animation: slide-up 240ms ease-out 1;
}
@media (prefers-reduced-motion: reduce) {
  .toast { animation: none; }
}
```

## Details

Animate transform and opacity when possible. Those two can run on the compositor without layout, while width, height and top force work on every frame.

A keyframe name in @keyframes is case sensitive in CSS and must not be quoted in the animation shorthand.
