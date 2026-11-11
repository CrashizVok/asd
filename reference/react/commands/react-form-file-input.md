# file input

React command · Forms

Always uncontrolled. Read event.target.files, send FormData, and clear it through a ref.

## Syntax

```jsx
<input type="file" onChange={(e) => setFile(e.target.files[0])} />
```

## Example

```jsx
const [image, setImage] = useState(null);
const fileRef = useRef(null);

<input
  ref={fileRef}
  type="file"
  name="image"
  accept="image/*"
  onChange={(event) => setImage(event.target.files[0] ?? null)}
/>

// on submit
const data = new FormData();
data.append('image', image);
data.append('city', form.city);
await fetch('/api/bookings', { method: 'POST', body: data });
```

## Details

React cannot set the value of a file input, so there is no controlled version. `files` is a read only `FileList`; take one entry, or use `Array.from(files)` when the input has `multiple`.

`accept="image/*"` only filters the picker. Check the type and the size in code before uploading, because a user can choose any file through the system dialog.

Send the file with `FormData` and let the browser set the multipart boundary. Do not put a `File` into `JSON.stringify`; it becomes `{}` and the upload arrives empty.
