# placeholder

HTML command · Forms

Shows hint text inside an empty field. It disappears on typing and is not a label, so keep a real label for accessibility.

## Syntax

```html
<input placeholder="name@example.com">
```

## Example

```html
<label for="customer_email">Email</label>
<input id="customer_email" type="email" name="customer_email"
       placeholder="name@example.com">
<!-- placeholder is not announced as a label by every screen reader -->
```
