# transition

CSS command · Transition

Sets property, duration, timing and delay in one declaration. The first time value is the duration and the second is the delay.

## Syntax

```css
transition: property duration timing-function delay, ...;
```

## Example

```css
/* duration 240ms, delay 0s */
.card {
  transition: transform 240ms ease-out 0s, box-shadow 240ms ease-out 0s;
}

/* wrong order: waits 240ms, then runs in 60ms */
.broken {
  transition: opacity 240ms 60ms ease;
}
```

## Details

Comma separated layers are matched against the longhand lists by position, and a shorter list repeats from its first value.

Important detail: writing `transition` resets all four longhands. A delay set in an earlier rule is cleared by a later shorthand that omits it, because the missing value goes back to `0s`.
