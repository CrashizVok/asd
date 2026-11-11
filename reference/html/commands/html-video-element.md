# <video>

HTML command · Media

Embeds a video player with native controls. Width and height reserve the box, poster shows a still before playback.

## Syntax

```html
<video src="clip.mp4" controls width="640" height="360"></video>
```

## Example

```html
<figure>
  <video controls width="640" height="360"
         poster="room-poster.jpg" preload="metadata" playsinline>
    <source src="room-tour.webm" type="video/webm">
    <source src="room-tour.mp4" type="video/mp4">
    <track kind="captions" src="room-tour.en.vtt"
           srclang="en" label="English" default>
    <p>
      Your browser cannot play this video.
      <a href="room-tour.mp4">Download the room tour</a> (8 MB).
    </p>
  </video>
  <figcaption>Room 304, the double room with a balcony.</figcaption>
</figure>
```

## Details

Controls are not optional for content the user is meant to watch. Without them the element is a still frame.

playsinline stops iOS from taking the video fullscreen on its own. autoplay only works when the video is muted in Chrome and Safari, and moving content over five seconds still needs a pause control. The paragraph inside the element is the fallback for browsers without video support and is worth writing every time.
