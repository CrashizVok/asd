# style

HTML command · Global attributes

Applies inline CSS to a single element. It wins over most stylesheet rules, which makes it quick for a test and painful to maintain.

## Syntax

```html
<p style="color: #b00020">
```

## Example

```html
<!-- inline style: highest specificity except !important -->
<p style="color: #b00020; font-weight: bold">
  Booking cancelled
</p>

<!-- the same look as a reusable class -->
<p class="alert">Booking cancelled</p>
```
