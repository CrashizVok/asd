# @media print

CSS command · Print and accessibility

Styles that apply only on paper or PDF. Hide navigation and forms, then let the text use the full width with readable contrast.

## Syntax

```css
@media print { ... }
```

## Example

```css
@media print {
  nav, .no-print, form button { display: none; }
  body { color: #000; background: #fff; font-size: 11pt; }
  /* the address stays readable when the link text is not a URL */
  a::after { content: " (" attr(href) ")"; }
}
```
