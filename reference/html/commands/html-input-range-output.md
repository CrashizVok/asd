# range with output

HTML command · Input

A slider for coarse numeric input, paired with an output element that shows the current value.

## Syntax

```html
<input type="range" min="0" max="100" step="10"> <output for="id">
```

## Example

```html
<!-- The slider always has a value; required would do nothing -->
<label for="max_price">Maximum price</label>
<input id="max_price" name="max_price" type="range"
       min="40" max="300" step="10" value="120">
<output id="price_out" for="max_price">120 EUR</output>

<script>
  const slider = document.querySelector('#max_price');
  const out = document.querySelector('#price_out');

  slider.addEventListener('input', () => {
    out.textContent = `${slider.value} EUR`;
  });
</script>
```

## Details

A range always has a value, defaulting to the midpoint of `min` and `max` when no `value` is set, so `required` on it is pointless. Use `number` when the user must type an exact figure. The output element associates with the slider through `for`, and the script keeps the text in step with the thumb.
