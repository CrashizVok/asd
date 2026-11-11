# skew()

CSS command · Transform

Shears the box along one or both axes. Child content is sheared too.

## Syntax

```css
transform: skew(ax, ay); | skewX(ax); | skewY(ay);
```

## Example

```css
.band {
  padding: 48px 20px;
  background-color: #24518f;
  color: #ffffff;
  transform: skewY(-3deg);
}

/* opposite angle puts the text upright again */
.band__inner {
  transform: skewY(3deg);
}
```
