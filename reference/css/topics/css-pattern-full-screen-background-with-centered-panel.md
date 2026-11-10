# Pattern: full-screen background with centered panel

CSS topic · Exam Wiki

```css
.hero {
  min-height: 100vh;
  background: url("../img/hotel.jpg") center / cover no-repeat;
  display: grid;
  place-items: center;
}
.panel {
  max-width: 1100px;
  width: calc(100% - 32px);
  padding: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
}
```

`center / cover` centers the image and covers the box. The panel stays readable because it has its own background. `calc(100% - 32px)` keeps a gutter on small screens.
