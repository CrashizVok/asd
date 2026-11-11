# perspective

CSS command · 3D

Sets the viewer distance for 3D children, so rotations project with depth instead of looking flat.

## Syntax

```css
perspective: 900px; | transform: perspective(900px) rotateY(20deg);
```

## Example

```css
/* one shared stage for all children */
.stage {
  perspective: 900px;
  perspective-origin: 50% 50%;
}

.card {
  transform: rotateY(25deg);
}

/* per element vanishing point, as the first function */
.lonely {
  transform: perspective(900px) rotateY(25deg);
}
```

## Details

Smaller values exaggerate depth. A range of 600px to 1200px reads naturally for cards. `perspective-origin` moves the vanishing point and defaults to the centre of the parent.

Without any perspective, `rotateY` looks like a horizontal squash, which is the usual reason a 3D effect appears broken.
