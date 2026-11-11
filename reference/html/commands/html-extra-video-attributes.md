# video attributes

HTML command · Media

controls adds the player UI and poster shows a still before playback. autoplay works only when muted in most browsers, and preload hints how much to fetch.

## Syntax

```html
<video controls width="640" poster="cover.jpg">
```

## Example

```html
<video controls width="640" poster="img/hotel-cover.jpg"
       preload="metadata" playsinline muted>
  <source src="media/tour.webm" type="video/webm">
  <source src="media/tour.mp4" type="video/mp4">
  Your browser cannot play this video.
</video>
<!-- playsinline stops iOS from going fullscreen on play -->
```
