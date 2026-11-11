# transition-duration

CSS command · Transition

Sets how long the interpolation runs. Initial value is 0s, so a transition without a duration does nothing.

## Syntax

```css
transition-duration: 200ms;
```

## Example

```css
.quick {
  transition-duration: 120ms;
}

.panel {
  transition-duration: 400ms;
}

/* several properties, one duration each, paired by position */
.mixed {
  transition-property: opacity, transform;
  transition-duration: 150ms, 300ms;
}
```

## Details

Negative values are invalid and the browser drops the whole declaration. Below one second, milliseconds are easier to compare at a glance. Past roughly 400ms the effect starts to feel like waiting rather than feedback.
