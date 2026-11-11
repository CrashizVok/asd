# currentColor

CSS command · Colour

Resolves to whatever color the element has. It keeps borders, icons and underlines in sync with one declaration.

## Syntax

```css
border-color: currentColor;
```

## Example

```css
.link {
  color: #0b5cad;
  /* border and icon follow the text colour */
  border-bottom: 2px solid currentColor;
}
.link:hover { color: #083f77; }
```
