# viewport meta tag

CSS command · Responsive setup

Makes the layout viewport match the device width. Without it a phone renders at about 980px and zooms out.

## Syntax

```css
<meta name="viewport" content="width=device-width, initial-scale=1">
```

## Example

```css
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- No maximum-scale and no user-scalable=no: both block pinch zoom. -->
```

## Details

Test the result at 375px wide. With the tag in place, `100vw` is 375px and a `min-width: 48em` query does not match, which is what the mobile layout expects.
