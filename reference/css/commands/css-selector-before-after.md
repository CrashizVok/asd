# ::before and ::after

CSS command · Selectors

Creates a pseudo-element before or after the content. The content property is required.

## Syntax

```css
.required::after { content: " *"; color: red; }
```

## Example

```css
.required::after {
  content: " *";
  color: #b91c1c;
}

.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
```
