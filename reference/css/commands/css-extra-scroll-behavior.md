# scroll-behavior

CSS command · Scrolling

Makes programmatic and anchor scrolling animate instead of jump. Respect prefers-reduced-motion, because smooth motion can cause nausea.

## Syntax

```css
scroll-behavior: smooth;
```

## Example

```css
/* smooth only when the user allows motion */
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```
