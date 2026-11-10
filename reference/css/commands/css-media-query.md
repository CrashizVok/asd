# @media

CSS command · Responsive

Applies rules only when the condition matches. Mobile-first uses min-width; desktop-first uses max-width.

## Syntax

```css
@media (max-width: 700px) { ... }
```

## Example

```css
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 700px) {
  .cards {
    grid-template-columns: 1fr;
  }
}
```
