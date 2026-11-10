# CSS in Vite

React topic · Exam Wiki

```jsx
import './styles.css';
```

A plain CSS import applies to the whole app. Keep class names specific enough to avoid collisions. For a quick layout:

```css
.page {
    min-height: 100vh;
    padding: 96px 20px 40px;
    background: url('/backgroundImage.jpg') center / cover no-repeat;
}

.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 20px;
}
```

Vite serves files in `public/` from `/`. `url('/backgroundImage.jpg')` works when the file is `public/backgroundImage.jpg`.
