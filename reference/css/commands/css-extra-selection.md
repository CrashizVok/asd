# ::selection

CSS command · Colour

Styles the highlighted text after a drag or Ctrl+A. Only colour, background and text shadow apply.

## Syntax

```css
::selection { background: #1f6feb; color: #fff; }
```

## Example

```css
/* one rule for the page, one override for quotes */
::selection {
  background: #1f6feb;
  color: #fff;
}
.quote ::selection {
  background: #f2cc60;
  color: #000;
}
```
