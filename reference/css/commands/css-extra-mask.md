# mask-image

CSS command · Effects

Hides parts of an element with a mask image: opaque areas stay, transparent areas are removed. It fades edges without touching layout.

## Syntax

```css
mask-image: linear-gradient(#000 60%, transparent);
```

## Example

```css
.fade-bottom {
  /* opaque keeps, transparent hides */
  mask-image: linear-gradient(#000 60%, transparent);
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
}
```
