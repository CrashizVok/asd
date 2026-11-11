# absolute centering

CSS command · Positioning

Sets all four offsets plus auto margins, so the fixed size box centers on both axes.

## Syntax

```css
.modal { position: absolute; inset: 0; margin: auto; width: 320px; height: 200px; }
```

## Example

```css
.panel {
  position: absolute;
  inset: 0;
  margin: auto;        /* auto margins absorb the leftover space on both sides */
  width: 320px;
  height: 200px;
}

/* Shorter alternative: let the parent center the child. */
.backdrop {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
}
```
