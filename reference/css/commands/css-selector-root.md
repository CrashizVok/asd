# :root

CSS command · Selectors

Selects the document root, usually html. It is the usual place for CSS variables.

## Syntax

```css
:root { --accent: teal; }
```

## Example

```css
:root {
  --bg: #0b0f14;
  --text: #e6edf3;
  --accent: #5eead4;
}

body {
  background: var(--bg);
  color: var(--text);
}
```
