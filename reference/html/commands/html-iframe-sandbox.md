# sandbox

HTML command · Embedding

Restricts what an embedded document may do. An empty value blocks scripts, forms, popups and same-origin access.

## Syntax

```html
<iframe src="..." sandbox="allow-scripts allow-forms"></iframe>
```

## Example

```html
<!-- Untrusted third party widget: scripts only, no same-origin access. -->
<iframe
  src="/embed/widget.html"
  title="Availability calendar"
  width="480"
  height="360"
  loading="lazy"
  sandbox="allow-scripts allow-forms">
</iframe>

<!-- Our own map page: scripts and same origin are fine here. -->
<iframe
  src="/embed/map.html"
  title="Map showing Riverside Hotel on Dock Street"
  width="640"
  height="360"
  sandbox="allow-scripts allow-same-origin allow-popups">
</iframe>
```

## Details

Tokens: allow-scripts, allow-same-origin, allow-forms, allow-popups, allow-downloads, allow-presentation, allow-top-navigation-by-user-activation. Start with an empty sandbox and add only what the frame needs.

allow-scripts plus allow-same-origin on a same-origin frame lets the document remove its own sandbox, which defeats the point. Never combine them for content you do not control. Refusing to be framed is a response header (Content-Security-Policy frame-ancestors or X-Frame-Options), not an HTML attribute.
