# <track>

HTML command · Media

Adds timed text to video or audio from a WebVTT file. Kind decides whether it is captions, subtitles, chapters or metadata.

## Syntax

```html
<track kind="captions" src="clip.en.vtt" srclang="en" label="English" default>
```

## Example

```html
<video controls width="640" height="360" poster="room-poster.jpg">
  <source src="room-tour.mp4" type="video/mp4">

  <!-- Captions include sounds, not only dialogue. -->
  <track kind="captions" src="room-tour.en.vtt"
         srclang="en" label="English" default>
  <track kind="captions" src="room-tour.hu.vtt"
         srclang="hu" label="Magyar">

  <p><a href="room-tour.mp4">Download the room tour</a></p>
</video>
```

## Details

Kinds: subtitles translate dialogue for viewers who can hear it; captions also carry non-speech sounds and are what most pages need; descriptions give text descriptions of the visuals; chapters build a chapter menu; metadata is for scripts.

A WebVTT file starts with WEBVTT, then cues with a timing line such as 00:00:01.000 --> 00:00:04.000 and text lines. Serve it as text/vtt. Cross origin tracks fail silently unless the media element has crossorigin="anonymous" and the track server sends CORS headers.
