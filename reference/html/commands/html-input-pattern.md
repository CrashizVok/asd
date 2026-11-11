# pattern

HTML command · Validation

Requires the whole value to match a JavaScript regular expression. No slashes and no anchors, because the match is already anchored.

## Syntax

```html
<input pattern="[0-9]{4}" title="Four digits">
```

## Example

```html
<!-- Anchored full match: no slashes, no ^ and $ -->
<label for="postal_code">Postal code</label>
<input id="postal_code" name="postal_code" type="text"
       pattern="[0-9]{4}" maxlength="4"
       inputmode="numeric" title="Four digits">

<label for="code">Verification code</label>
<input id="code" name="code" type="text"
       pattern="[0-9]{6}" maxlength="6"
       autocomplete="one-time-code" title="Six digits">
```

## Details

`pattern` applies only to text-like inputs: text, search, url, tel, email, and password. It is ignored on number, date, time, range, color, checkbox, radio, file, hidden, and the button types. Modern browsers compile the pattern with the `v` regex flag, so escape characters such as `-` inside a character class. Always add a `title` that states the rule in words.
