# flex-basis

CSS command · Flex items

The starting main size of an item before grow and shrink run. It wins over width on the main axis.

## Syntax

```css
flex-basis: auto | 200px | 0 | 30%;
```

## Example

```css
.card {
  flex-basis: 260px; /* start at 260px */
  flex-grow: 1;      /* then take a share of what is left */
  flex-shrink: 1;    /* then give way when the row overflows */
}

/* auto falls back to width, then to content size */
.card--content-sized {
  flex-basis: auto;
}
```
