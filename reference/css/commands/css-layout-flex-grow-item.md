# flex-grow

CSS command · Flex items

A share of the container's free space, distributed in proportion to the value. Default 0 means no growth.

## Syntax

```css
flex-grow: 0;
```

## Example

```css
.split {
  display: flex;
  gap: 16px;
}

.split__aside { flex-grow: 1; } /* one third of the extra width */
.split__main  { flex-grow: 2; } /* two thirds */
```
