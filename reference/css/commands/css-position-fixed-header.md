# fixed header

CSS command · Positioning

Pins the header to the top of the viewport. The body must reserve the same height or the first content slides under it.

## Syntax

```css
.header { position: fixed; inset: 0 0 auto 0; height: 64px; }
```

## Example

```css
:root {
  --header-h: 64px;
}

.header {
  position: fixed;
  inset: 0 0 auto 0;   /* top 0, right 0, bottom auto, left 0 */
  height: var(--header-h);
  z-index: 10;
}

body {
  padding-top: var(--header-h);
}

html {
  /* Anchor links scroll 12px below the header instead of under it. */
  scroll-padding-top: calc(var(--header-h) + 12px);
}
```

## Details

A `transform`, `filter`, `perspective` or `contain: paint` on an ancestor makes that ancestor the containing block, and the header scrolls with the page. Check the wrapper before adding more `z-index`.
