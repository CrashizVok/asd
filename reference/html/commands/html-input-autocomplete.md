# autocomplete

HTML command · Input

Names the field's meaning so the browser can autofill it. Use the standard tokens instead of inventing values.

## Syntax

```html
<input name="customer_email" type="email" autocomplete="email">
```

## Example

```html
<label for="first_name">First name</label>
<input id="first_name" name="first_name" type="text" autocomplete="given-name">

<label for="last_name">Last name</label>
<input id="last_name" name="last_name" type="text" autocomplete="family-name">

<label for="customer_email">Email</label>
<input id="customer_email" name="customer_email" type="email" autocomplete="email">

<label for="birthday">Birthday</label>
<input id="birthday" name="birthday" type="date" autocomplete="bday">

<!-- A new password field is not the same token as an existing one -->
<label for="password">Password</label>
<input id="password" name="password" type="password" autocomplete="new-password">
```
