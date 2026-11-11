# align-self

CSS command · Flex and grid alignment

Overrides align-items for a single item on the cross axis. In a flex row that is vertical placement, in a grid cell it is the block axis.

## Syntax

```css
align-self: center;
```

## Example

```css
.toolbar {
  display: flex;
  align-items: stretch;
}
.toolbar .icon {
  /* this item ignores the stretch and centres itself */
  align-self: center;
}
```
