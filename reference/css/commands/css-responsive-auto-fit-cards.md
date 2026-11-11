# auto-fit card grid

CSS command · Responsive layout

Fits as many cards per row as the container allows and reflows without any media query.

## Syntax

```css
grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
```

## Example

```css
.cards {
  display: grid;
  gap: 16px;
  /* min(100%, 240px) stops the track from overflowing a container
     narrower than 240px, which a bare 240px would do. */
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  padding: 0;
  margin: 0;
  list-style: none;
}
```

## Details

`auto-fit` collapses empty tracks, `auto-fill` keeps them. Cards want `auto-fit`. If prices must line up in cards of different heights, make each card `display: flex; flex-direction: column` and give the price `margin-top: auto`.
