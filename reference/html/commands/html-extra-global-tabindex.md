# tabindex

HTML command · Global attributes

Places an element in the keyboard tab order. 0 means natural order, -1 means focusable by script but not by Tab.

## Syntax

```html
tabindex="0"
```

## Example

```html
<!-- custom control that must be reachable with Tab -->
<div role="button" tabindex="0" onclick="save()"
     onkeydown="if (event.key === 'Enter') save()">
  Save draft
</div>

<!-- panel that receives focus from JavaScript only -->
<div id="dialog" tabindex="-1">...</div>
```

## Details

Avoid positive values. tabindex="1" jumps ahead of the document order and makes the Tab sequence hard to predict.

A div with tabindex and a click handler still announces nothing. Add a role and key handling, or use a button.
