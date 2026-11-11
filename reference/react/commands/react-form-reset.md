# reset a form

React command · Form submission

A controlled form clears through state. form.reset() only restores DOM defaults and the state value returns.

## Syntax

```jsx
setForm(EMPTY_FORM); fileRef.current.value = '';
```

## Example

```jsx
const EMPTY = { email: '', city: '', terms: false };
const [form, setForm] = useState(EMPTY);
const fileRef = useRef(null);

function reset() {
  setForm(EMPTY);
  setErrors({});
  if (fileRef.current) fileRef.current.value = '';
}

<button type="button" onClick={reset}>Reset</button>
```

## Details

A `<button type="reset">` and `form.reset()` send the form back to its HTML default values. For a controlled input the next render puts the state value straight back, so the field looks like it refused to clear.

Uncontrolled inputs do reset with `form.reset()`. A file input is always uncontrolled and needs the ref line above.

A third option is a changing `key` on the form. React throws the subtree away and rebuilds it empty, which is handy when the form is generated from a record and the user switches records.
