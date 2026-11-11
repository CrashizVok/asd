# contenteditable

HTML command · Global attributes

Turns an element into an editable region. Browsers then accept typing and paste inside it without a form control.

## Syntax

```html
contenteditable="true"
```

## Example

```html
<div id="note" contenteditable="true" aria-label="Booking note">
  <!-- the user can edit this text directly -->
  Late arrival, around 23:00.
</div>

<!-- plaintext-only blocks pasted markup in supporting browsers -->
<div contenteditable="plaintext-only">No pasted tags</div>
```

## Details

The edited text is not submitted with a form. Read element.innerHTML or element.textContent in your script and copy it into a hidden input.

Paste can bring markup, so sanitize the result on the server as well.
