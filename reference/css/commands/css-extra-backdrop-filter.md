# backdrop-filter

CSS command · Effects

Filters what shows through a translucent element, the frosted glass effect. Without a transparent background there is nothing to blur.

## Syntax

```css
backdrop-filter: blur(8px);
```

## Example

```css
.sheet {
  position: fixed;
  inset: auto 0 0 0;
  background: rgba(255, 255, 255, 0.65); /* must be translucent */
  backdrop-filter: blur(8px) saturate(1.2);
}
```
