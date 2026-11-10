# Pseudo-elements and combinators

CSS topic · Exam Wiki

```css
.card::before {
  content: "";
  display: block;
  height: 4px;
  background: #2563eb;
}

.card > h2 { margin-top: 0; }
.card + .card { margin-top: 16px; }
.card:hover { border-color: #2563eb; }
.card:focus-within { outline: 2px solid #2563eb; }

li:nth-child(odd) { background: #f9fafb; }
input:not([type="checkbox"]) { width: 100%; }
```

`::before` and `::after` create a decorative box; `content` is required. `>` is a direct child, `+` the next sibling, `~` any later sibling. `:nth-child` counts among siblings. `:not()` excludes a case.
