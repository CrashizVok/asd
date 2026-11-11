# 375px overflow check

CSS command · Responsive setup

The first rules to add when a phone layout scrolls sideways. Then find the single wide element instead of hiding the overflow.

## Syntax

```css
img, video, iframe { max-width: 100%; }
```

## Example

```css
/* Media cannot overflow its container. */
img,
video,
iframe,
svg {
  max-width: 100%;
  height: auto;
}

/* Long words and URLs wrap instead of pushing the line wide. */
p, li {
  overflow-wrap: anywhere;
}

/* Debug only: outline every box, then look for the one that crosses the edge. */
/* body * { outline: 1px solid rgb(255 0 0 / 25%); } */

/* Do not ship overflow-x: hidden on the body. It hides the symptom
   and lets the wide element keep breaking the layout. */
```

## Details

Check at 375px, then at 200 percent zoom, which leaves about 187px of layout width. A page that needs no horizontal scroll at both sizes has no fixed pixel widths left in the hot path.
