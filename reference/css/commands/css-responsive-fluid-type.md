# fluid type with clamp()

CSS command · Units and sizing

Scales a heading with the viewport inside fixed limits. The preferred value mixes rem and vw so the user's font setting still applies.

## Syntax

```css
font-size: clamp(min, preferred, max);
```

## Example

```css
h1 {
  /* 28px minimum, 44px maximum, gentle growth between. */
  font-size: clamp(1.75rem, 1.25rem + 2.2vw, 2.75rem);
  line-height: 1.15;
}

.wrap {
  /* Cap the width and keep a gutter in one declaration. */
  width: min(1100px, 100% - 32px);
  margin-inline: auto;
}
```

## Details

A preferred value of pure `2.5vw` ignores the user's font size setting at the low end and gives about 9px on a 375px screen. Keep a `rem` part in the middle value and a `rem` minimum.
