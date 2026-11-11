# auto margin in flex

CSS command · Flex items

An auto margin absorbs the free space on that side, pushing an item to the far end without a spacer element.

## Syntax

```css
margin-left: auto;
```

## Example

```css
.navbar {
  display: flex;
  align-items: center;
  gap: 24px;
}

.navbar__signin {
  margin-left: auto; /* everything after this sits at the far end */
}
```
