# aria-label

HTML command · Accessibility attributes

Sets the accessible name when the element has no visible text. The name is spoken, so it must not repeat the role word.

## Syntax

```html
aria-label="Close dialog"
```

## Example

```html
<button aria-label="Close dialog">
  <!-- icon only button: the name comes from aria-label -->
  <svg aria-hidden="true" width="16" height="16">...</svg>
</button>

<!-- bad: the word button is read twice -->
<button aria-label="button close">X</button>
```
