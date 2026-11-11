# input type="password"

HTML command · Forms

Masks typed characters. Masking is visual only: the value is plain text in the page, so the form must use HTTPS and POST.

## Syntax

```html
<input type="password" name="password">
```

## Example

```html
<form action="/login" method="post">
  <label for="password">Password</label>
  <input id="password" type="password" name="password"
         autocomplete="current-password" required minlength="8">
  <button>Sign in</button>
</form>
<!-- use autocomplete="new-password" on a registration form -->
```
