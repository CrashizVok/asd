# color-scheme

CSS command · Colour

Declares which colour schemes an element supports, so form controls, scrollbars and the canvas pick matching defaults.

## Syntax

```css
color-scheme: light dark;
```

## Example

```css
:root {
  /* native widgets may render dark when the system is dark */
  color-scheme: light dark;
}
@media (prefers-color-scheme: dark) {
  :root { --bg: #10141a; --fg: #e6edf3; }
}
```
