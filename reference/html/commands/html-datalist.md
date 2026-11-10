# <datalist>

HTML command · Forms

Provides suggested values for an input. The user can still type a value that is not in the list.

## Syntax

```html
<input list="cities"><datalist id="cities"><option value="Budapest"></datalist>
```

## Example

```html
<label for="city">City</label>
<input id="city" name="city" list="cities">
<datalist id="cities">
  <option value="Budapest">
  <option value="Debrecen">
</datalist>
```
