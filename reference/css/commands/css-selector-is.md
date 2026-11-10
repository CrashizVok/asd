# :is() and :where()

CSS command · Selectors

Groups selectors. :is takes the highest specificity of its arguments; :where has zero specificity.

## Syntax

```css
:is(h1, h2, h3) { line-height: 1.2; }
```

## Example

```css
:is(h1, h2, h3) {
  line-height: 1.2;
}

:where(.card, .panel) {
  padding: 16px;
}
```
