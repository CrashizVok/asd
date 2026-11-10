# grid-template-areas and grid-area

CSS command · Grid

Names areas and places items by name. Good for page layouts.

## Syntax

```css
grid-template-areas: "head head" "side main";
```

## Example

```css
.layout {
  display: grid;
  grid-template-areas:
    "head head"
    "side main";
  grid-template-columns: 240px 1fr;
}

.header { grid-area: head; }
.sidebar { grid-area: side; }
.main { grid-area: main; }
```
