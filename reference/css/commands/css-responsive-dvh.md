# dvh and svh viewport units

CSS command · Units and sizing

Dynamic and small viewport heights, so a full screen panel is not cut off by the mobile browser toolbar.

## Syntax

```css
min-height: 100dvh;
```

## Example

```css
.panel {
  /* Shrinks and grows with the toolbar. */
  min-height: 100dvh;
}

.hero {
  /* The safe choice: never taller than the visible area. */
  min-height: 60svh;
}

/* Avoid 100vw for full width blocks: it includes the desktop scrollbar
   and can add a horizontal scrollbar. Use 100% instead. */
.full { width: 100%; }
```
