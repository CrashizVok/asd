# button type

HTML command · Buttons

Sets what a button does. Inside a form the default is submit, so any other button needs type="button" explicitly.

## Syntax

```html
<button type="button|submit|reset">Label</button>
```

## Example

```html
<!-- Explicit submit -->
<button type="submit">Save</button>

<!-- No form action: safe inside a form -->
<button type="button" id="add_guest">Add another guest</button>

<!-- Reset throws away typed data, rarely a good idea -->
<button type="reset">Clear</button>

<!-- Two submits in one form, the clicked one adds name=value -->
<button type="submit" name="intent" value="publish">Publish</button>
<button type="submit" name="intent" value="draft" formnovalidate>Save draft</button>
```

## Details

A button with no `type` inside a form behaves as a submit button, which is how a filter toggle accidentally sends the form. Use `type="button"` for anything driven by JavaScript that should not submit. A submit button with `name` and `value` contributes its own pair, and per-button overrides such as `formaction` and `formnovalidate` win over the form attributes.
