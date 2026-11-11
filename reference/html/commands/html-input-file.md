# file upload

HTML command · Input

Opens the system file picker. accept filters the dialog, multiple allows several files, and the form needs multipart encoding.

## Syntax

```html
<input type="file" name="image" accept="image/png" multiple>
```

## Example

```html
<!-- The form needs multipart/form-data for this to work -->
<form action="/profile" method="post" enctype="multipart/form-data">
  <label for="image">Profile photo</label>
  <input id="image" name="image" type="file"
         accept="image/png, image/jpeg" required>

  <label for="documents">Documents</label>
  <input id="documents" name="documents" type="file" multiple>

  <button type="submit">Upload</button>
</form>
```

## Details

Without `enctype="multipart/form-data"` the server receives a filename string instead of file bytes. `accept` is a picker hint, not a security check, so verify the real type and size on the server. Scripts cannot set the input value to a local path, and reading `value` gives a fake path. Use `input.files` to inspect the selection.
