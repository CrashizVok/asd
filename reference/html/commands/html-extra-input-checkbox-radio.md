# input type="checkbox" and "radio"

HTML command · Forms

A checkbox allows several answers, a radio allows one per name. A value is sent only when checked, and a checkbox with no value sends on.

## Syntax

```html
<input type="checkbox" name="extras" value="breakfast">
```

## Example

```html
<!-- the same name groups radios into one choice -->
<fieldset>
  <legend>Extras</legend>
  <label><input type="checkbox" name="extras" value="breakfast" checked> Breakfast</label>
  <label><input type="checkbox" name="extras" value="parking"> Parking</label>
</fieldset>

<fieldset>
  <legend>Room view</legend>
  <label><input type="radio" name="view" value="city" checked> City</label>
  <label><input type="radio" name="view" value="sea"> Sea</label>
</fieldset>
```
