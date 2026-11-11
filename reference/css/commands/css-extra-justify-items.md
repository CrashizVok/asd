# justify-items

CSS command · Grid

Sets the default inline axis alignment for every item in a grid container. One item can override it with justify-self.

## Syntax

```css
justify-items: center;
```

## Example

```css
.cells {
  display: grid;
  grid-template-columns: repeat(3, 120px);
  /* every child centred in its cell unless it sets justify-self */
  justify-items: center;
}
```
