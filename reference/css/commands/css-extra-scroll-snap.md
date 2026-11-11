# scroll-snap-type

CSS command · Scrolling

Makes a scroll container snap to child points. The container sets the axis and strictness, children set scroll-snap-align.

## Syntax

```css
scroll-snap-type: x mandatory;
```

## Example

```css
/* every slide snaps to the left edge */
.slider {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
.slide {
  flex: 0 0 100%;
  scroll-snap-align: start;
}
```
