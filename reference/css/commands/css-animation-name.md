# animation-name

CSS command · Animation

Picks which @keyframes block to run. Initial value is none.

## Syntax

```css
animation-name: slide-up;
```

## Example

```css
.hero {
  animation-name: slide-up;
  animation-duration: 450ms;
}

/* several animations at once, paired by position */
.status {
  animation-name: fade-in, pulse;
  animation-duration: 300ms, 2s;
  animation-iteration-count: 1, infinite;
}
```

## Details

A misspelled name produces no animation and no console error, so check the spelling first when nothing happens. Two animations on one element must not animate the same property, or the later one in the list wins for the overlap.
