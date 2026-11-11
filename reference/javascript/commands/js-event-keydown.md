# keydown and event.key

JavaScript command · Forms and keyboard

keydown fires when a key goes down and repeats while it is held. key is the character or name, code is the physical key, and the modifier booleans cover Ctrl, Alt, Shift, and Meta.

## Syntax

```js
event.key
event.code
```

## Example

```js
document.addEventListener("keydown", (event) => {
  const typing = event.target.closest(
    "input, textarea, select, [contenteditable=true]"
  );
  if (typing) return; // do not steal keys from a field

  if (event.key === "Escape") closeDialog();

  const save = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s";
  if (save) {
    event.preventDefault();
    saveDraft();
  }
});

function closeDialog() {}
function saveDraft() {}
```

## Details

`event.key` values include `"Enter"`, `"Escape"`, `"ArrowLeft"`, `" "` for space, and `"a"` or `"A"` depending on Shift. `event.code` values include `"KeyA"`, `"Space"`, and `"Digit1"`.

`event.repeat` is true for the repeated events while a key is held, which is useful for scrolling a list and wrong for toggling a dialog.

`keypress` is deprecated. `keyCode` is deprecated and layout dependent.
