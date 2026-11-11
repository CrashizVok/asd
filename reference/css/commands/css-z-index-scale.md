# z-index scale with custom properties

CSS command · Stacking

Keeps layer values in one place so a new component can be inserted between two existing ones.

## Syntax

```css
--z-header: 10; --z-modal: 100;
```

## Example

```css
:root {
  --z-base: 0;
  --z-header: 10;
  --z-dropdown: 20;
  --z-backdrop: 100;
  --z-modal: 110;
  --z-toast: 120;
}

.header { position: sticky; top: 0; z-index: var(--z-header); }
.backdrop { position: fixed; inset: 0; z-index: var(--z-backdrop); }
.modal { position: fixed; z-index: var(--z-modal); }

/* A child with z-index 9999 inside .header still loses to .backdrop,
   because the header's context caps it at 10. */
```
