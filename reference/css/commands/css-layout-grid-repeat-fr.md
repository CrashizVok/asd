# repeat()

CSS command · Grid

Repeats a track definition a fixed number of times, or as many times as fit when combined with auto-fill or auto-fit.

## Syntax

```css
repeat(3, 1fr);
```

## Example

```css
.equal {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* three equal columns */
  gap: 16px;
}

.mixed {
  display: grid;
  grid-template-columns: 80px repeat(2, 1fr) 120px;
  gap: 8px;
}
```

## Details

`repeat()` takes either a count or an auto keyword, never both: `repeat(3, 1fr)` and `repeat(auto-fit, 1fr)` are legal, `repeat(3, auto-fill)` is not. A `1fr` track is really `minmax(auto, 1fr)`, so long unbreakable content can widen it.
