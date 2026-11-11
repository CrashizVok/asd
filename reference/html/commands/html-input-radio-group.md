# radio group

HTML command · Choice

Radios sharing a name form one group where only one option can be checked. Each radio needs its own value and its own label.

## Syntax

```html
<input type="radio" name="room" value="single">
```

## Example

```html
<!-- Shared name is the group; fieldset only labels it -->
<fieldset>
  <legend>Room type</legend>
  <label><input type="radio" name="room" value="single" required> Single</label>
  <label><input type="radio" name="room" value="double" checked> Double</label>
  <label><input type="radio" name="room" value="twin"> Twin</label>
</fieldset>
```

## Details

The group is defined by the shared `name`, not by the fieldset. The fieldset and legend only supply the spoken group label. Without a `value`, the checked radio submits the string `on`, which tells the server nothing. Give exactly one option a `checked` attribute when a default makes sense.
