# animation-play-state

CSS command · Animation

Freezes or resumes an animation in place.

## Syntax

```css
animation-play-state: running | paused;
```

## Example

```css
.ticker__track {
  animation: ticker 16s linear infinite;
}

/* let people stop a moving strip by hovering or tabbing to it */
.ticker:hover .ticker__track,
.ticker:focus-within .ticker__track {
  animation-play-state: paused;
}
```

## Details

Pausing holds the computed state instead of resetting it, so the element resumes from the same point. This is the standard accessible control for marquees, tickers and any loop that runs longer than a few seconds.
