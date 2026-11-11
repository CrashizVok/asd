# enctype

HTML command · Forms

Sets how the body is encoded. File uploads need multipart/form-data, the default urlencoded cannot carry binary content.

## Syntax

```html
enctype="multipart/form-data"
```

## Example

```html
<form action="/upload" method="post" enctype="multipart/form-data">
  <input type="file" name="image" accept="image/*">
  <button>Upload</button>
</form>
<!-- enctype is ignored on GET forms -->
```
