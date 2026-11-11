# track

HTML command · Media

Adds a text track to video or audio. captions also describe sounds, subtitles assume the viewer hears the audio.

## Syntax

```html
<track kind="captions" src="subs.en.vtt" srclang="en" label="English">
```

## Example

```html
<video controls src="media/tour.mp4">
  <track kind="captions" src="subs/tour.en.vtt" srclang="en" label="English" default>
  <track kind="captions" src="subs/tour.hu.vtt" srclang="hu" label="Magyar">
</video>
<!-- exactly one default track, the rest appear in the player menu -->
```
