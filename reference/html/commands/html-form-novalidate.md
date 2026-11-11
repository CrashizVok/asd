# novalidate and formnovalidate

HTML command · Form

novalidate turns off browser validation for the whole form. formnovalidate turns it off for one submit button, which is the usual Save draft behaviour.

## Syntax

```html
<form novalidate> | <button formnovalidate>
```

## Example

```html
<form action="/article" method="post">
  <label for="title">Title</label>
  <input id="title" name="title" required>

  <!-- Publish runs validation, draft does not -->
  <button type="submit" name="intent" value="publish">Publish</button>
  <button type="submit" name="intent" value="draft" formnovalidate>Save draft</button>
</form>
```
