# autocomplete

HTML command · Forms

Tells the browser what a field holds so it can fill saved values. Correct tokens on login and address forms save real typing on mobile.

## Syntax

```html
autocomplete="email"
```

## Example

```html
<input type="email" name="customer_email" autocomplete="email">
<input type="text" name="first_name" autocomplete="given-name">
<input type="text" name="last_name" autocomplete="family-name">
<input type="tel" name="phone" autocomplete="tel">
<input type="password" name="password" autocomplete="current-password">
<!-- new-password on sign up, one-time-code on a code field -->
```
