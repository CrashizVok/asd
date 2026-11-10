# Audio and video

HTML topic · Exam Wiki

```html
<video controls width="640" poster="poster.jpg">
  <source src="tour.mp4" type="video/mp4">
  Your browser does not support video.
</video>

<audio controls>
  <source src="intro.mp3" type="audio/mpeg">
  Your browser does not support audio.
</audio>
```

`controls` shows the browser player. The text inside is a fallback. `poster` is the image before playback. Do not autoplay sound; browsers block it and users dislike it.
