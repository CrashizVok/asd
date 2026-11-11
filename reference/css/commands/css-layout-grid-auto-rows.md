# grid-auto-rows

CSS command · Grid

Sizes rows the browser creates for items that do not fit the declared grid. Default auto means each row hugs its content.

## Syntax

```css
grid-auto-rows: 200px;  grid-auto-rows: minmax(200px, auto);
```

## Example

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  grid-auto-rows: minmax(220px, auto); /* equal tiles with a height floor */
  gap: 16px;
}
```
