# aria-describedby

HTML command · Accessibility attributes

Adds a hint or error message after the name is announced. Screen readers read it after the label, not instead of it.

## Syntax

```html
aria-describedby="email-hint"
```

## Example

```html
<!-- the hint is read after the label, not instead of it -->
<label for="customer_email">Email</label>
<input id="customer_email" name="customer_email" type="email"
       aria-describedby="email-hint">
<p id="email-hint">We send the confirmation here.</p>
```
