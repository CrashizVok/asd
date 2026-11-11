# text-indent

CSS command · Typography

Indents the first line of a block. A negative value plus matching padding produces a hanging indent.

## Syntax

```css
text-indent: 2rem;
```

## Example

```css
.prose p { text-indent: 2rem; }

.hanging {
  /* pull the first line left, pad the wrapped lines */
  padding-left: 2rem;
  text-indent: -2rem;
}
```
