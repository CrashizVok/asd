# input type="number" and "range"

HTML command · Forms

number accepts digits and arrow keys, range draws a slider. Both send a string, so parse before arithmetic. step decides which values are valid.

## Syntax

```html
<input type="number" min="0" max="10" step="1">
```

## Example

```html
<!-- range needs a small script to show its current value -->
<label for="adults">Adults</label>
<input id="adults" type="number" name="adults" min="1" max="6" step="1" value="2">

<label for="children">Children</label>
<input id="children" type="range" name="children" min="0" max="4" step="1" value="0">
<output for="children">0</output>
```
