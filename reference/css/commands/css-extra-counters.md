# CSS counters

CSS command · Typography

Numbers elements with generated counters through counter-reset, counter-increment and content. It numbers nested sections without manual text.

## Syntax

```css
counter-reset: section;
```

## Example

```css
body { counter-reset: section; }
h2 { counter-increment: section; }
h2::before {
  /* 1. , 2. , 3. before each heading */
  content: counter(section) ". ";
}
```
