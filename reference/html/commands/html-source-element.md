# <source>

HTML command · Media

Offers the browser one file to choose from. The browser takes the first source it can play, using type to skip formats it does not support.

## Syntax

```html
<source src="file.webm" type="video/webm">
```

## Example

```html
<video controls width="640" height="360" poster="room-poster.jpg">
  <!-- The browser picks the first file it can play, in this order. -->
  <source src="room-tour.webm" type="video/webm">
  <source src="room-tour.mp4" type="video/mp4; codecs=avc1.42E01E, mp4a.40.2">

  <!-- Not a retry chain: a failed first file does not fall through. -->
  <p><a href="room-tour.mp4">Download the room tour</a></p>
</video>
```

## Details

Without type the browser may download the whole file just to discover it cannot play it. With type it can skip the file immediately.

The source list is a preference order, not an error recovery chain. If the chosen file 404s, the browser does not move to the next one. The media attribute on source is for picture, not for video or audio.
