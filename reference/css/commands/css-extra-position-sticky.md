# position: sticky

CSS command · Positioning

Sticks an element at a threshold while its scrolling ancestor moves, then stops at the ancestor edge. A top, right, bottom or left value is required.

## Syntax

```css
position: sticky; top: 0;
```

## Example

```css
.table-head th {
  position: sticky;
  top: 0;           /* without this the element does not stick */
  background: #fff; /* rows would scroll under it */
  z-index: 1;
}
```
