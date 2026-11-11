# aria-live

HTML command · Accessibility attributes

Announces changes inside a region without moving focus. polite waits for a pause, assertive interrupts the current sentence.

## Syntax

```html
aria-live="polite"
```

## Example

```html
<p id="cart-count" aria-live="polite">2 rooms</p>

<script>
  // the change is spoken and focus stays in the form
  document.getElementById('cart-count').textContent = '3 rooms';
</script>
```

## Details

The region must exist in the page before the text changes. Creating an element with pre-filled text and aria-live usually announces nothing, because there was no change to observe.

role="status" is polite and role="alert" is assertive. Both imply aria-live, so do not add the attribute twice.
