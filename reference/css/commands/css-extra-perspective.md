# perspective

CSS command · Transforms

Adds depth to 3D children of the element: smaller values exaggerate the effect. perspective-origin moves the vanishing point.

## Syntax

```css
perspective: 800px;
```

## Example

```css
.scene {
  /* set on the parent, not on the transformed child */
  perspective: 800px;
  perspective-origin: 50% 50%;
}
.scene .card { transform: rotateY(20deg); }
```
