# form enctype

HTML command · Form

Sets how the request body is encoded. File uploads need multipart/form-data; everything else uses the default urlencoded form.

## Syntax

```html
<form action="/upload" method="post" enctype="multipart/form-data">
```

## Example

```html
<!-- A file input needs multipart, or the server gets a filename -->
<form action="/profile" method="post" enctype="multipart/form-data">
  <label for="first_name">First name</label>
  <input id="first_name" name="first_name" type="text" required>

  <label for="image">Photo</label>
  <input id="image" name="image" type="file" accept="image/jpeg, image/png">

  <button type="submit">Save</button>
</form>
```
