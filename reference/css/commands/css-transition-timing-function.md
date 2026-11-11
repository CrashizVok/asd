# transition-timing-function

CSS command · Transition

Sets the speed curve of the interpolation. Initial value is ease.

## Syntax

```css
transition-timing-function: ease | linear | ease-in | ease-out | ease-in-out | cubic-bezier(x1, y1, x2, y2) | steps(n, end);
```

## Example

```css
.fade {
  transition: opacity 200ms ease-out;
}

/* overshoot: y values may leave the 0 to 1 range */
.pop {
  transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* quantised time, one jump per tick */
.ticks {
  transition: transform 1s steps(12, end);
}
```

## Details

`ease-out` decelerates into the destination and suits entrances. `linear` is correct for spinners and progress bars, where a varying speed reads as stutter. In `cubic-bezier(x1, y1, x2, y2)` the x values must stay between 0 and 1 because time cannot run backwards, while the y values may overshoot to create a bounce without keyframes.

`step-start` equals `steps(1, start)` and `step-end` equals `steps(1, end)`.
