# responsive card gallery

CSS command · Layout patterns

A card row that reflows by available width, with no media query. The track count changes as the container changes.

## Syntax

```css
grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
```

## Example

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  grid-auto-rows: minmax(260px, auto);
  gap: 24px;
  padding: 24px;
}

.gallery .card {
  display: grid;
  grid-template-rows: 160px 1fr; /* image band, then text */
  overflow: hidden;
  border-radius: 12px;
  background: #fff;
}

.gallery .card img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* crop, do not distort */
  display: block;
}
```
