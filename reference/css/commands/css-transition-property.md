# transition-property

CSS command · Transition

Chooses which properties a transition watches. The initial value is all, which is why one duration alone animates everything.

## Syntax

```css
transition-property: property | none | all;
```

## Example

```css
/* only the two properties that should move get a transition */
.card {
  transition-property: transform, box-shadow;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgb(15 23 42 / 0.16);
}

/* the padding change below stays instant on purpose */
.card.is-large {
  padding: 28px;
}
```

## Details

A shorthand such as `background` also covers its longhands, because longhands are what actually interpolate. Listing properties instead of `all` keeps unrelated changes from sliding: with `all`, a border colour changed by a theme class animates for no reason.

`none` switches every transition off for the element, which is a quick way to disable motion inside a media query.
