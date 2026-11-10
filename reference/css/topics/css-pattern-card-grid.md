# Pattern: card grid

CSS topic · Exam Wiki

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  padding: 24px;
}
.card { background: #fff; border-radius: 12px; overflow: hidden; }
.card img { width: 100%; height: 180px; object-fit: cover; display: block; }
```

`object-fit: cover` stops image distortion. `overflow: hidden` clips the image to the rounded corners.
