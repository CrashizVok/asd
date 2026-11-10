# transition

CSS command · Effects

Animates changes to properties over time. Name the property, duration, timing function, and optional delay.

## Syntax

```css
transition: background 0.2s ease, transform 0.2s ease;
```

## Example

```css
.button {
  transition: background 0.2s ease, transform 0.2s ease;
}

.button:hover {
  background: #0f766e;
  transform: translateY(-2px);
}
```
