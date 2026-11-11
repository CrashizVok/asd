# grid-template-areas

CSS command · Grid

Names grid cells with strings so items can be placed by area name. Each string is a row, each word a column, and a dot leaves a cell empty.

## Syntax

```css
grid-template-areas: 'header header' 'aside main';
```

## Example

```css
.layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  /* two rows, two columns, named cells */
  grid-template-areas:
    "header header"
    "aside  main";
}

.layout > header { grid-area: header; }
.layout > aside  { grid-area: aside; }
.layout > main   { grid-area: main; }
```

## Details

Every row string must name the same number of columns, and a named area must form a rectangle. A typo in grid-area silently places the item in the first free cell.

The strings are layout, not content. Screen readers still follow the DOM order, so keep the markup in a reading order that makes sense.
