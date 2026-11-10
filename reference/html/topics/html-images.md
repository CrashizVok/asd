# Images

HTML topic · Exam Wiki

```html
<img src="img/room.jpg" alt="Double room with sea view" width="640" height="420">
<img src="img/icon.svg" alt="" aria-hidden="true">
<figure>
  <img src="img/lobby.jpg" alt="Hotel lobby at night">
  <figcaption>The lobby, open all night.</figcaption>
</figure>
```

`alt` describes the image for someone who cannot see it. Decorative images get `alt=""` so they are skipped. Set `width` and `height` to reserve space and avoid layout shift. Use `<picture>` or `srcset` for different sizes.
