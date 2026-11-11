# audio attributes

HTML command · Media

controls shows play, pause and volume. loop repeats, and preload="none" avoids downloading until the user presses play.

## Syntax

```html
<audio controls src="chime.mp3"></audio>
```

## Example

```html
<audio controls preload="none">
  <source src="media/chime.ogg" type="audio/ogg">
  <source src="media/chime.mp3" type="audio/mpeg">
  Your browser cannot play this sound.
</audio>
<!-- autoplay with sound is blocked until the visitor interacts with the page -->
```
