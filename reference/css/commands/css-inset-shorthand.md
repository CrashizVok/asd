# inset

CSS command · Positioning

Shorthand for the four offsets. Values follow the same order as margin.

## Syntax

```css
inset: top right bottom left;
```

## Example

```css
.cover {
  position: absolute;
  inset: 0;               /* all four sides */
}

.gutter {
  position: absolute;
  inset: 12px 24px;       /* 12px top and bottom, 24px left and right */
}

.translated {
  position: absolute;
  inset-inline-start: 0;  /* left in English, right in Arabic or Hebrew */
}
```
