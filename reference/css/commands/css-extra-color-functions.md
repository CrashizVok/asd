# rgb() and hsl()

CSS command · Colour

Builds a colour from channels. rgb and hsl accept a slash alpha, and modern browsers also accept oklch and lab.

## Syntax

```css
color: hsl(210 70% 40% / 0.9);
```

## Example

```css
.badge {
  /* hue, saturation, lightness, then alpha after the slash */
  color: hsl(210 70% 40%);
  background: hsl(210 70% 40% / 0.12);
}
.badge--new { color: oklch(55% 0.16 250); }
```
