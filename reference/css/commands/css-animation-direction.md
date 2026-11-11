# animation-direction

CSS command · Animation

Chooses which way the timeline is read on each pass.

## Syntax

```css
animation-direction: normal | reverse | alternate | alternate-reverse;
```

## Example

```css
/* one out and back, not two passes forward */
.breathe {
  animation: breathe 2s ease-in-out infinite alternate;
}

/* same frames, counter clockwise */
.counter-spin {
  animation: spin 800ms linear infinite reverse;
}
```

## Details

`alternate` flips every second iteration, so an infinite two second animation breathes without a second keyframe block. With `alternate`, `iteration-count: 2` shows one full cycle, because each iteration is a single pass through the timeline.
