# order

CSS command · Flex items

Changes paint order among flex or grid items. Lower numbers come first, ties keep source order.

## Syntax

```css
order: 0;
```

## Example

```css
.row {
  display: flex;
}

.row__badge {
  order: -1; /* painted first, still last in the DOM */
}

.row__hint {
  order: 1; /* painted last */
}
```

## Details

Order changes the visual sequence only. Tab order and screen reader order stay in DOM order, so moving a link or a button with `order` produces a mismatch for keyboard users. Keep it for decoration, or reorder the markup instead.
