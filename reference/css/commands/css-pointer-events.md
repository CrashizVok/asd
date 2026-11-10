# pointer-events

CSS command · Effects

Controls whether an element can be the target of mouse events. Useful for overlays and disabled controls.

## Syntax

```css
pointer-events: none;
```

## Example

```css
.overlay {
  pointer-events: none;
}

.overlay.is-open {
  pointer-events: auto;
}
```
