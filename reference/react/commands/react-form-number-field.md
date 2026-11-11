# number input

React command · Forms

The value is a string even with type number. Keep the string in state and convert once, at submit.

## Syntax

```jsx
<input type="number" value={count} onChange={(e) => setCount(e.target.value)} />
```

## Example

```jsx
const [adults, setAdults] = useState('2');

function handleSubmit(event) {
  event.preventDefault();
  const count = Number(adults);
  if (!Number.isInteger(count) || count < 1) {
    setError('Whole number, at least 1.');
    return;
  }
  save({ adults: count });
}
```

## Details

Two traps. A cleared number field gives `''`, and `Number('')` is `0`, so a required field can look like a valid zero. A partially typed value such as `-` or `1e` also reports an empty string in some browsers.

`event.target.valueAsNumber` is the alternative: it gives `NaN` for an empty or incomplete value.

```jsx
function handleChange(event) {
  const next = event.target.valueAsNumber;
  setAdults(Number.isNaN(next) ? '' : next);
}
```

Whichever route you take, do the range check with `Number.isInteger` and explicit bounds. `min` and `max` on the input only guide the spinner and the browser check.
