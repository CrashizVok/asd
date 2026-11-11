# checkbox

React command · Forms

A single checkbox holds a boolean in checked. It does not use value, and it reads event.target.checked.

## Syntax

```jsx
<input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
```

## Example

```jsx
const [agree, setAgree] = useState(false);

<label>
  <input
    type="checkbox"
    checked={agree}
    onChange={(event) => setAgree(event.target.checked)}
  />
  I accept the terms
</label>

<button type="submit" disabled={!agree}>Continue</button>
```

## Details

Writing `value={agree}` with `event.target.value` stores the string `"on"` and the box stops following state. That is the most common mistake in exam answers.

A group of checkboxes holds an array. Toggle by building a new array:

```jsx
function toggle(list, value) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

setExtras((prev) => toggle(prev, 'breakfast'));
```
