# place-items

CSS command · Grid

Shorthand for align-items and justify-items, which align items inside their cells. The shortest way to centre one child.

## Syntax

```css
place-items: center;
```

## Example

```css
.hero {
  display: grid;
  place-items: center; /* one child, centred on both axes */
  min-height: 60vh;
}

/* track alignment is a different pair:
   justify-content and align-content move the tracks themselves */
```
