# <figure> and <figcaption>

HTML command · Semantics

A figure groups content the text refers to, with an optional caption. The caption must be the first or the last child.

## Syntax

```html
<figure>
  <img src="..." alt="...">
  <figcaption>Caption</figcaption>
</figure>
```

## Example

```html
<p>The room has a balcony facing the river.</p>

<figure>
  <img src="river-view.jpg"
       alt="A river seen from a hotel window, with a bridge on the left"
       width="800" height="450">
  <figcaption>The view from room 304, taken at sunset.</figcaption>
</figure>
```

## Details

The alt text describes the image for someone who cannot see it. The caption is visible text that explains why the image is there. Repeating the same sentence in both makes a screen reader say it twice.

A figure is not required for every image. Use it when the text points at the image or the caption adds information. A decorative image uses alt="" and needs no figure.
