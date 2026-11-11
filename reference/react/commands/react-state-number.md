# number input state

React command · Forms

Converts the string from a number input and guards against an empty or invalid field.

## Syntax

```jsx
setAdults(Math.max(0, Number(e.target.value) || 0))
```

## Example

```jsx
const [adults, setAdults] = useState(2);

<input
  type="number"
  min="0"
  value={adults}
  onChange={event => {
    // Number('') is 0, so the || 0 catches NaN and keeps state a number.
    const next = Math.max(0, Number(event.target.value) || 0);
    setAdults(next);
  }}
/>
```

## Details

Every input event carries a string, even when `type="number"`. Storing the string works until you compare or add it. `"2" + 1` gives `"21"`.

`Number('abc')` is `NaN`, and an input bound to `NaN` warns. The `|| 0` turns both `NaN` and an empty string into zero, and `Math.max` keeps the value from going negative through the spinner. Clamp in the handler so the state shape stays clean for the rest of the app.
