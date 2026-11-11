# <audio>

HTML command · Media

Embeds an audio player. It has no visual area, so width, height and poster do not apply.

## Syntax

```html
<audio src="clip.mp3" controls></audio>
```

## Example

```html
<figure>
  <audio controls preload="metadata">
    <source src="interview.mp3" type="audio/mpeg">
    <source src="interview.opus" type="audio/ogg; codecs=opus">
    <track kind="chapters" src="interview.chapters.vtt"
           label="Chapters" default>
    <p><a href="interview.mp3">Download the interview</a> (12 MB, MP3).</p>
  </audio>
  <figcaption>Eight minutes with the front desk manager.</figcaption>
</figure>
```

## Details

Audio needs a text path. A transcript on the page, or a link to one, is the only way a deaf user gets the content.

The player is small and unlabelled by itself, so the surrounding heading or figure caption must say what it contains.
