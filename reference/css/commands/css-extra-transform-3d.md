# 3D transforms

CSS command · Transforms

Moves and rotates on three axes. The z value only shows with perspective on an ancestor, and 3D transforms can blur text.

## Syntax

```css
transform: translate3d(0, 0, 40px) rotateY(12deg);
```

## Example

```css
/* the faces need a 3D context to flip in */
.flip-card {
  transform-style: preserve-3d;
  transition: transform 400ms;
}
.flip-card:hover { transform: rotateY(180deg); }
```
