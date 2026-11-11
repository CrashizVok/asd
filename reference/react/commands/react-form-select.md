# select

React command · Forms

The value lives on select, not on option. A first option with an empty value works as the placeholder.

## Syntax

```jsx
<select value={city} onChange={(e) => setCity(e.target.value)}>
```

## Example

```jsx
const [city, setCity] = useState('');

<select
  name="city"
  value={city}
  onChange={(event) => setCity(event.target.value)}
>
  <option value="">Choose a city</option>
  <option value="Budapest">Budapest</option>
  <option value="Vienna">Vienna</option>
</select>
```

## Details

Every option needs a `value`. Without one the browser uses the option text, which breaks when the label changes or gets translated.

For a multiple select the state is an array:

```jsx
<select multiple value={cities} onChange={(event) => {
  const picked = Array.from(event.target.selectedOptions, (option) => option.value);
  setCities(picked);
}}>
```

A checkbox group is usually the better interface for several choices, because a multiple select needs a modifier key.
