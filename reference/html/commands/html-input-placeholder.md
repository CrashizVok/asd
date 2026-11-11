# placeholder

HTML command · Input

Shows example text inside an empty field. It disappears on the first keystroke and never replaces a label.

## Syntax

```html
<input name="q" type="search" placeholder="Sea view">
```

## Example

```html
<label for="q">Search rooms</label>
<input id="q" name="q" type="search" placeholder="Sea view">

<label for="site">Website</label>
<input id="site" name="site" type="url" placeholder="https://example.com">
```

## Details

Placeholder text is usually rendered at low contrast and is not announced as the field name by every screen reader. Some browsers do not support it on `number`, and it is meaningless on `date`, `color`, `range`, `file`, `checkbox`, and `radio`. Keep a visible `label` and treat the placeholder as an optional hint.
