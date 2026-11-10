# Pseudo-classes

CSS topic · Exam Wiki

```css
li:first-child { }
li:last-child  { }
li:nth-child(2n) { }      /* even items */
input:focus    { outline: 2px solid var(--brand); }
input:invalid  { border-color: #c0392b; }
.card:hover    { }
a:visited      { }
:not(.active)  { }
```

`:focus-visible` targets keyboard focus only, which is the accessible choice for outlines. Never remove a focus outline without a replacement.
