# em breakpoints

CSS command · Breakpoints

Breakpoints in em follow the user's font size and zoom. One em inside a query is the initial font size, normally 16px.

## Syntax

```css
@media (min-width: 48em) { }
```

## Example

```css
/* 48em is 768px at the default 16px root, and 960px at a 20px user setting. */
@media (min-width: 48em) {
  .layout {
    grid-template-columns: 220px 1fr;
  }
}

/* Pick the number where the content breaks, not the name of a device. */
@media (min-width: 60em) {
  .cards { grid-template-columns: repeat(3, 1fr); }
}
```
