# ::marker

CSS command · Typography

Styles the list bullet or number. Only font, colour and content apply, so background and padding are ignored.

## Syntax

```css
::marker { color: #1f6feb; }
```

## Example

```css
/* bullets follow the brand colour */
li::marker {
  color: #1f6feb;
  font-weight: 700;
}
li.done::marker {
  content: "OK ";
}
```
