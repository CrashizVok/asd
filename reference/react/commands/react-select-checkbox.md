# select and checkbox

React command · Forms

Select uses value and onChange. Checkbox uses checked and onChange with event.target.checked.

## Syntax

```jsx
<select value={value} onChange={...}>
```

## Example

```jsx
<select value={city} onChange={(e) => setCity(e.target.value)}>
  <option value="budapest">Budapest</option>
  <option value="debrecen">Debrecen</option>
</select>

<input
  type="checkbox"
  checked={agree}
  onChange={(e) => setAgree(e.target.checked)}
/>
```
