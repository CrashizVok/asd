# visually hidden text

CSS command · Print and accessibility

Hides content from sight while keeping it for screen readers. Use it for labels and skip links, never with display none.

## Syntax

```css
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
```

## Example

```css
.sr-only {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
/* the text is still read aloud */
```
