# sticky table header

CSS command · Positioning

Keeps the header row visible inside a scrolling table or list without JavaScript.

## Syntax

```css
th { position: sticky; top: 0; }
```

## Example

```css
.table-wrap {
  max-height: 360px;
  overflow: auto;      /* this element becomes the scrollport */
}

.table-wrap thead th {
  position: sticky;
  top: 0;
  background: #f4f7fb; /* must be opaque, or rows show through */
  border-bottom: 1px solid #d8dde6;
}
```
