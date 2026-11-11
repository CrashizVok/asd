# input type="email"

HTML command · Forms

A text field that expects an address and gets a keyboard with the at sign on mobile. The browser checks the shape, not that the mailbox exists.

## Syntax

```html
<input type="email" name="customer_email">
```

## Example

```html
<label for="customer_email">Email</label>
<input id="customer_email" name="customer_email" type="email"
       required multiple placeholder="name@example.com">
<!-- multiple allows a comma separated list of addresses -->
```
