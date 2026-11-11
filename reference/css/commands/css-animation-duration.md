# animation-duration

CSS command · Animation

Time for one pass through the keyframes. Initial value is 0s, so a name without a duration never shows.

## Syntax

```css
animation-duration: 800ms;
```

## Example

```css
@keyframes spin {
  to { transform: rotate(1turn); }
}

.spinner {
  animation-name: spin;
  animation-duration: 800ms;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
```

## Details

Negative values are invalid. Entrance animations usually sit between 300ms and 500ms, small feedback under 150ms, and loops are chosen by how much work the loop does rather than by taste.
