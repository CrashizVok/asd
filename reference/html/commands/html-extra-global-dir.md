# dir

HTML command · Global attributes

Sets text direction: ltr, rtl or auto. auto lets the browser decide from the first strong character, which suits user generated text.

## Syntax

```html
<p dir="rtl">
```

## Example

```html
<!-- explicit direction for a right to left block -->
<p dir="rtl" lang="ar">حجز غرفة</p>

<!-- auto follows the first strong character in the value -->
<p dir="auto">user typed text goes here</p>

<!-- CSS can react: html[dir="rtl"] .arrow { transform: scaleX(-1); } -->
```
