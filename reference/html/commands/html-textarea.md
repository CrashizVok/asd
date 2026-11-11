# textarea

HTML command · Choice

A multi-line text field. Its value is the text between the tags, not a value attribute, and line breaks are submitted as part of the value.

## Syntax

```html
<textarea id="notes" name="notes" rows="4"></textarea>
```

## Example

```html
<!-- The text between the tags is the value, there is no value attribute -->
<label for="notes">Notes</label>
<textarea id="notes" name="notes" rows="4" maxlength="500"
          placeholder="Allergies, late arrival, anything else">Late arrival, around 22:00.</textarea>
```

## Details

`<textarea value="...">` does nothing. Put the initial text between the tags, and remember that the parser drops one newline directly after the opening tag. `rows` and `cols` set the initial size in characters, and CSS should control the final size. A `maxlength` here counts characters, including line breaks.
