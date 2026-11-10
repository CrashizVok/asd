# CSS variables

CSS command · Responsive

Stores reusable values. Change the variable once to update every use.

## Syntax

```css
:root { --gap: 16px; } .box { gap: var(--gap); }
```

## Example

```css
:root {
  --bg: #0b0f14;
  --card: #11151c;
  --text: #e6edf3;
  --accent: #5eead4;
  --radius: 16px;
}

.card {
  background: var(--card);
  color: var(--text);
  border-radius: var(--radius);
}
```
