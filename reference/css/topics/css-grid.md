# Grid

CSS topic · Exam Wiki

Two axes. Good for page layouts and card galleries.

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-areas: "side main";
}
```

`auto-fit` with `minmax` gives a responsive card grid without media queries. `fr` splits the free space. `grid-column: 1 / -1` spans the full row. `place-items: center` centers a single child on both axes.
