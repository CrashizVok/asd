# @keyframes

CSS command · Animation

Declares the frames an animation interpolates between. The name is referenced by animation-name.

## Syntax

```css
@keyframes name { 0% { ... } 100% { ... } }
```

## Example

```css
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: slide-up 420ms ease-out both;
}
```

## Details

`from` equals `0%` and `to` equals `100%`, and both forms can be mixed with percentages. Properties missing from every keyframe keep the element's normal style.

Two blocks with the same name do not merge: the later one replaces the earlier completely. Duplicate offsets inside one block merge declaration by declaration.
