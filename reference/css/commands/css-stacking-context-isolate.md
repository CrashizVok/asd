# isolation: isolate

CSS command · Stacking

Creates a stacking context with no visual side effect, so a component's internal z-index values stay inside it.

## Syntax

```css
.widget { isolation: isolate; }
```

## Example

```css
.widget {
  isolation: isolate;   /* like a z-index context, but no layer change */
  position: relative;
}

.widget__badge {
  position: absolute;
  z-index: 2;           /* cannot climb above the widget now */
}
```
