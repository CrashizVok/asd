# <iframe>

HTML command · Embedding

Embeds another HTML document in its own browsing context. The title is what a screen reader announces for the frame.

## Syntax

```html
<iframe src="/embed/map.html" title="Map showing the hotel" width="640" height="360"></iframe>
```

## Example

```html
<div class="embed">
  <iframe
    src="/embed/map.html?q=Dock+Street+12"
    title="Map showing Riverside Hotel on Dock Street"
    width="640"
    height="360"
    loading="lazy"
    referrerpolicy="no-referrer">
  </iframe>
</div>

<p>
  If the map does not load,
  <a href="/embed/map.html?q=Dock+Street+12">open it in a new page</a>.
</p>
```

## Details

The frame is a separate document: its own lang, headings, landmarks and focus order. Nothing from the parent page reaches inside, and the embedded page has to be accessible on its own.

Use frames for maps, players, payment forms and document previews, not for the site navigation or the whole page. Always give a direct link to the content as an alternative. Reserve width and height, or the page shifts when the frame loads.
