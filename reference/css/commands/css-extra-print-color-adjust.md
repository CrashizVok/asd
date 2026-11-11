# print-color-adjust

CSS command · Print and accessibility

Asks the browser to keep backgrounds and colours in print. By default printers drop backgrounds to save ink.

## Syntax

```css
print-color-adjust: exact;
```

## Example

```css
.status-badge {
  /* keep the colour instead of white boxes on paper */
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
```
