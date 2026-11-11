# minmax()

CSS command · Grid

Gives a track a minimum and a maximum size. The common fix for both fixed floors and content overflow.

## Syntax

```css
minmax(240px, 1fr);
```

## Example

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}

/* 0 as the minimum lets the track shrink below its content */
.two {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
}
```
