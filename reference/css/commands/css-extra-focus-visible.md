# :focus-visible

CSS command · Print and accessibility

Matches keyboard focus and skips the ring on a mouse click. It keeps focus obvious for keyboard users without the click ring on buttons.

## Syntax

```css
:focus-visible { outline: 2px solid #1f6feb; }
```

## Example

```css
button:focus-visible {
  outline: 2px solid #1f6feb;
  outline-offset: 2px;
}
/* never remove the ring without a replacement */
button:focus:not(:focus-visible) { outline: none; }
```
