# class

HTML command · Global attributes

Attaches one or more space separated names. CSS and querySelectorAll use them to style a group of elements, and one element can carry several classes at once.

## Syntax

```html
<div class="card card--wide">
```

## Example

```html
<article class="card card--wide">
  <!-- two classes: a base style and a modifier -->
  <h3 class="card__title">Hotel Belvedere</h3>
</article>

<style>
  .card { border: 1px solid #ccd; padding: 1rem; }
  .card--wide { grid-column: span 2; }
</style>
```

## Details

Keep class names lowercase and hyphenated. A class is reusable, an id is not, so style with classes and reserve ids for anchors and script hooks.
