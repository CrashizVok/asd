# break-inside

CSS command · Print and accessibility

Controls where a printed page may split. break-inside avoid keeps a card or row whole, break-before page starts a new sheet.

## Syntax

```css
break-inside: avoid;
```

## Example

```css
.booking-card {
  /* do not cut a card across two sheets */
  break-inside: avoid;
}
h2.new-chapter {
  break-before: page;
}
```
