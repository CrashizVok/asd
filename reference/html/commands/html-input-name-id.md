# input name and id

HTML command · Form

name is the key sent to the server and can repeat. id is a unique page hook used by label, CSS, and JavaScript, and is never submitted.

## Syntax

```html
<input id="customer_email" name="customer_email" type="email">
```

## Example

```html
<!-- name: submitted key, id: label hook -->
<label for="customer_email">Email</label>
<input id="customer_email" name="customer_email" type="email" required>

<!-- Repeated name: one pair per ticked box -->
<label><input type="checkbox" name="extras" value="breakfast"> Breakfast</label>
<label><input type="checkbox" name="extras" value="parking"> Parking</label>
```

## Details

A control without `name` is skipped at submit time even when the user filled it in. A control without `id` still submits, but a `label for` cannot point at it. Duplicate ids are invalid HTML and make the second label focus the first element. The `form="form-id"` attribute lets a control sit outside the form element and still be submitted with it.
