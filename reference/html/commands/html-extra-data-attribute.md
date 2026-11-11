# data-* attributes

HTML command · Global attributes

Stores custom data on an element without inventing an attribute name. JavaScript reads it through the dataset object.

## Syntax

```html
data-hotel-id="42"
```

## Example

```html
<button class="book" data-hotel-id="42" data-stars="4">Book</button>

<script>
  const button = document.querySelector('.book');
  // data-hotel-id becomes dataset.hotelId (camelCase)
  console.log(button.dataset.hotelId); // "42"
</script>
```
