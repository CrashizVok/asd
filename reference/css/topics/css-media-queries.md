# Media queries

CSS topic · Exam Wiki

Mobile first: base styles for small screens, then widen.

```css
@media (min-width: 768px) { .grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 600px) { .nav { display: none; } }
@media print { .navbar { display: none; } }
```

Common breakpoints in this repo: 600, 768, 1024. Use `min-width` for content that grows, `max-width` when hiding a desktop nav.
