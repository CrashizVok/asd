# spellcheck

HTML command · Global attributes

Hints whether the browser underlines spelling. Turn it off for booking codes and hex values.

## Syntax

```html
spellcheck="false"
```

## Example

```html
<textarea spellcheck="true" name="description">late arrival</textarea>

<!-- codes are not words, so no red underlines -->
<input type="text" name="booking_code" spellcheck="false" value="BK-2026-0042">
```
