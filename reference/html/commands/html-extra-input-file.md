# input type="file"

HTML command · Forms

Opens the file picker. The form must use method post and multipart/form-data, or only the filename arrives.

## Syntax

```html
<input type="file" name="image" accept="image/*">
```

## Example

```html
<form action="/upload" method="post" enctype="multipart/form-data">
  <label for="photo">Hotel photo</label>
  <!-- accept filters the picker, it does not validate the upload -->
  <input id="photo" type="file" name="image" accept="image/png,image/jpeg" multiple>
  <button>Send</button>
</form>
```
