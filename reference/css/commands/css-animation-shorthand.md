# animation

CSS command · Animation

Sets the animation longhands in one declaration. The first time value is the duration and the second is the delay.

## Syntax

```css
animation: name duration timing delay iteration direction fill-mode play-state;
```

## Example

```css
/* name, duration, timing, delay, iterations, direction, fill */
.hero {
  animation: panel-in 460ms cubic-bezier(0.22, 0.61, 0.36, 1) 80ms 1 normal both;
}

/* four layers at once */
.card {
  animation: slide-up 420ms ease-out both, glow 2s ease-in-out infinite;
}
```

## Details

Only the name is required, but a missing duration means `0s`, so the animation never becomes visible. Writing the shorthand resets every animation longhand, including `play-state`, which is why a later `animation` declaration undoes an earlier pause.
