# flex-direction

CSS command · Flexbox

Sets the main axis of a flex container, which decides what justify-content and align-items act on.

## Syntax

```css
flex-direction: row | row-reverse | column | column-reverse
```

## Example

```css
.page {
  display: flex;
  flex-direction: column; /* main axis is now vertical */
  min-height: 100vh;      /* needed before vertical distribution works */
}

.page__main {
  flex: 1; /* takes the free height, pushing the footer down */
}
```
