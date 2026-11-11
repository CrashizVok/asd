# fieldset and legend

HTML command · Form

Groups related controls and gives the group a name. A screen reader announces the legend when focus enters the group.

## Syntax

```html
<fieldset><legend>Group name</legend> ... </fieldset>
```

## Example

```html
<!-- The legend must be the first child of the fieldset -->
<fieldset>
  <legend>Guest details</legend>

  <label for="first_name">First name</label>
  <input id="first_name" name="first_name" type="text" required>

  <label for="last_name">Last name</label>
  <input id="last_name" name="last_name" type="text" required>
</fieldset>

<fieldset>
  <legend>Room type</legend>
  <label><input type="radio" name="room" value="single"> Single</label>
  <label><input type="radio" name="room" value="double"> Double</label>
</fieldset>
```

## Details

The legend must be the first child of the fieldset. A `disabled` attribute on the fieldset disables every control inside it, except controls inside the first legend. Radio grouping still comes from the shared `name`, not from the fieldset.
