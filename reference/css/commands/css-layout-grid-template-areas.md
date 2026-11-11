# grid-template-areas

CSS command · Grid

Describes the layout as a visual map of area names, one quoted string per row. Items attach with grid-area.

## Syntax

```css
grid-template-areas: "header header" "sidebar main";
```

## Example

```css
.layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-areas:
    "header  header"
    "sidebar main";
  gap: 16px;
}

.layout__header  { grid-area: header; }
.layout__sidebar { grid-area: sidebar; }
.layout__main    { grid-area: main; }
```

## Details

Every string must describe the same number of columns. A repeated name makes an area span, and a dot marks an empty cell. Each area must form a rectangle; an L shape makes the whole declaration invalid, so the layout silently falls back to auto placement.
