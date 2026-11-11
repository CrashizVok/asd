# transform-origin

CSS command · Transform

Sets the point that rotate, scale and skew act around. Default is 50% 50%, the centre of the border box.

## Syntax

```css
transform-origin: x y;
```

## Example

```css
/* grow out of the left edge */
.panel {
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 220ms ease-out;
}

.panel.open {
  transform: scaleX(1);
}

/* a clock hand hinged at its base */
.hand {
  transform-origin: 50% 100%;
  transform: rotate(90deg);
}
```

## Details

One value sets x and leaves y at the centre. Percentages resolve against the element's own box, so `100% 100%` is the bottom right corner. A third value sets the z position and only matters in 3D.

The property applies to the entire function list, not to a single function. Translation ignores it.
