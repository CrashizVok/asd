# HTML forms in depth

HTML topic · Exam Wiki

## Simplest form

```html
<!-- Data shape sent to the server: { customer_email: "ada@example.com" } -->
<form action="/subscribe" method="post">
  <label for="customer_email">Email</label>
  <input id="customer_email" name="customer_email" type="email" required>
  <button type="submit">Subscribe</button>
</form>
```

That is a complete, working form. `action` says where the data goes, `method` says how it travels, `name` becomes the key on the server, and the `label` plus `id` pair gives the field a visible and an accessible name.

## What happens when the form is submitted

The browser walks the form, collects every successful control, turns each one into a name and value pair, encodes the pairs, and sends one request. A control is successful when all of these hold:

- it has a `name` attribute,
- it is not `disabled`,
- for a checkbox or radio, it is checked,
- for a select, it has a selected option,
- it is not inside a disabled `fieldset`.

The submit button that started the submission is included too, under its own name and value. That is how a server can tell "Save draft" from "Publish" when both buttons sit in the same form.

`action` is the URL that receives the request. If you omit it, the browser posts back to the current document URL. An empty `action=""` does the same. `method` is `get` when omitted. `post` is the other value you will use.

With `method="get"` the pairs become a query string appended to the action URL, and an existing query string on the action is replaced. The result is bookmarkable and visible in the address bar. It is also size limited and completely unsuitable for passwords.

With `method="post"` the pairs go into the request body. The URL keeps whatever query string the action already had. Servers read the body, not the URL, and nothing shows up in browser history.

For the newsletter form above, the browser sends this body:

```text
customer_email=ada%40example.com
```

The `@` is percent-encoded, spaces become `+`, line breaks become `%0D%0A`, and non-ASCII characters are encoded as UTF-8 bytes. The `Content-Type` header is `application/x-www-form-urlencoded`. The default `enctype` produces that header, and it is correct for everything except file uploads.

`enctype` has three legal values:

- `application/x-www-form-urlencoded`, the default, pairs separated by `&`,
- `multipart/form-data`, required when the form contains `<input type="file">`,
- `text/plain`, a debugging format with no encoding rules. Never use it for real data.

A form with a file input but the default `enctype` still submits, and the server receives a filename instead of the file bytes. That bug is silent and common.

`novalidate` on the form switches off the browser's built-in validation for the whole form. `formnovalidate` on a submit button does it for one button only, which is what a "Save draft" button usually needs.

## name and id are different attributes

This is the single most common source of broken forms.

`name` is the key in the submitted data. It can repeat, and repetition is how checkbox groups and multi-selects send several values:

```html
<label><input type="checkbox" name="extras" value="breakfast"> Breakfast</label>
<label><input type="checkbox" name="extras" value="parking"> Parking</label>
```

If both are ticked the request contains `extras=breakfast&extras=parking`. Many server frameworks fold that into an array, but that folding is a server convention, not an HTML rule.

`id` is a document-wide unique hook for `label[for]`, CSS and JavaScript. It is never submitted. Two elements with the same `id` make the page invalid, and a label will then point at whichever element the browser found first.

A control with no `name` is skipped at submit time, even if the user filled it in. A control with no `id` still submits, but its label cannot use `for`, so the field loses its accessible name.

Controls do not have to live inside the form. The `form` attribute takes the id of a form elsewhere in the document:

```html
<form id="booking" action="/book" method="post">
  <label for="city">City</label>
  <input id="city" name="city">
</form>

<!-- Far away in the markup, still part of the same submission -->
<label for="notes">Notes</label>
<textarea id="notes" name="notes" form="booking"></textarea>
```

The remote control is submitted with that form and validated with it.

## Every part

### form

`action`, `method`, `enctype`, `novalidate`, `target`, `autocomplete`, and `name` are the attributes that matter for exams. `target` works like a link target and opens the response in a named browsing context. `autocomplete="off"` on the form is a hint to the browser, not a guarantee, and browsers increasingly ignore it on password fields.

A page can hold several forms. They do not nest. Nested `form` tags are invalid and the parser drops the inner one, which silently breaks its controls.

### label

Two legal shapes:

```html
<label for="email">Email</label>
<input id="email" name="email" type="email">

<label>
  Email
  <input name="email" type="email">
</label>
```

The first pairs `for` with `id`. The second wraps the control, and no `id` is needed. Both make the text clickable and both give the control its accessible name. A wrapping label may contain only one labelable control.

Do not use a `placeholder` as the label. It disappears on the first keystroke, it is usually low contrast, and it is not reliably announced as a name. Use a real label and keep the placeholder for an example value, if you use one at all.

### input, textarea, select, button

`<input>` is a void element whose behaviour is decided by `type`. `<textarea>` is not void, and its value is its text content:

```html
<textarea id="notes" name="notes" rows="4" maxlength="500">Late arrival.</textarea>
```

`<textarea value="...">` does nothing. The text between the tags is the value, whitespace and line breaks included, and the HTML parser drops one newline directly after the opening tag. `rows` and `cols` set the initial size in characters; CSS should own the final size.

`<select>` holds `<option>` elements. An option's submitted value is its `value` attribute, or its text content when `value` is missing. That default is a trap in a translated page: the visible label becomes the submitted value.

```html
<select id="hotel_id" name="hotel_id">
  <option value="">Choose a hotel</option>
  <option value="1">Grand Hotel</option>
  <option value="2" selected>Riverside Inn</option>
</select>
```

`<optgroup label="...">` groups options visually and in the accessibility tree. It cannot be selected itself. `multiple` on the select allows several selections and usually renders as a list box rather than a dropdown. `size` sets how many rows show.

### fieldset and legend

`<fieldset>` groups related controls, and its first child should be `<legend>`. The legend names the group, which is what a screen reader announces before reading the first radio inside it.

```html
<fieldset>
  <legend>Room type</legend>
  <label><input type="radio" name="room" value="single"> Single</label>
  <label><input type="radio" name="room" value="double"> Double</label>
</fieldset>
```

The radios form one group because they share `name`, not because they sit in the same fieldset. The fieldset only adds the visible and spoken group label. That distinction shows up in exams often.

A `disabled` attribute on the fieldset disables every control inside it, except controls inside the first legend. That is a neat way to lock a whole section while a request is in flight, and a nasty way to lose data if you forget it.

### Validation attributes

Browser validation is free and immediate, and it is never a substitute for server checks. The attributes:

- `required` rejects an empty value. On a radio group, one member carrying it is enough to require the group; put it on every member for clarity.
- `minlength` and `maxlength` count characters in text-like fields.
- `min` and `max` bound numbers, dates, times, and the range input.
- `step` sets the allowed increment. Numbers default to `1`, so `step="0.01"` is required for prices with cents, and `step="any"` removes the grid entirely. For dates, `step` counts days. For times, it counts seconds.
- `pattern` is a regular expression that the whole value must match. No slashes, no flags, and no need for `^` and `$`, because the match is already anchored.

```html
<label for="phone">Phone</label>
<input id="phone" name="phone" type="tel"
       pattern="[0-9+ \-]{7,20}"
       title="Digits, spaces, plus, and hyphen only">
```

`pattern` applies to text-like inputs. It does nothing on `number`, `date`, `range`, `color`, `checkbox`, `radio`, `file`, or the button types; those have their own validation or none.

`title` is not decoration here. Some browsers append it to the validation message, and it is the only place many users see the rule.

The browser blocks submission and shows a bubble when a constraint fails. That bubble cannot be styled, its text is browser and locale dependent, and its timing differs by browser. If the design needs inline errors, use the constraint validation API instead of fighting the bubble.

### The constraint validation API

Every labelable control exposes:

- `checkValidity()` returns a boolean and fires an `invalid` event,
- `reportValidity()` does the same and also shows the browser message,
- `setCustomValidity(message)` marks the control invalid until called again with an empty string,
- `validity` holds flags such as `valueMissing`, `typeMismatch`, `patternMismatch`, `tooShort`, `tooLong`, `rangeUnderflow`, `rangeOverflow`, `stepMismatch`, `badInput`, and `customError`.

```js
const form = document.querySelector('#booking');
const email = document.querySelector('#customer_email');

form.addEventListener('submit', (event) => {
  if (!form.checkValidity()) {
    event.preventDefault();
    form.reportValidity();
  }
});
```

Two methods on the form element are easy to confuse. `form.submit()` sends the form and skips validation entirely. `form.requestSubmit()` runs validation first and fires the `submit` event, which is what a custom button should call.

CSS can react with `:valid` and `:invalid`. Those match on page load, so a required empty field is already red before the user touches it. `:user-invalid` waits for interaction and is the better selector where it is supported.

### autocomplete and inputmode

`autocomplete` tells the browser what the field means, which enables autofill and helps users with motor impairments. Use the standard tokens instead of inventing your own:

```html
<input name="first_name" autocomplete="given-name">
<input name="last_name" autocomplete="family-name">
<input name="customer_email" type="email" autocomplete="email">
<input name="phone" type="tel" autocomplete="tel">
<input name="birthday" type="date" autocomplete="bday">
```

`inputmode` changes the on-screen keyboard without changing the data type or validation. `inputmode="numeric"` for a card number, `inputmode="decimal"` for a price, `inputmode="tel"` for a phone, `inputmode="email"` for an address. `enterkeyhint="search"` or `"next"` labels the phone keyboard's action key.

## Examples

### Example 1: a search form with GET

Search is the canonical GET form: the result URL should be shareable.

```html
<form action="/search" method="get">
  <label for="q">Search rooms</label>
  <input id="q" name="q" type="search" placeholder="Sea view" required>

  <label for="city">City</label>
  <select id="city" name="city">
    <option value="">Any city</option>
    <option value="budapest">Budapest</option>
    <option value="vienna">Vienna</option>
  </select>

  <button type="submit">Search</button>
</form>
```

Submitting with `q=double room` and Budapest selected produces:

```text
/search?q=double+room&city=budapest
```

The empty option submits `city=` when nothing is chosen. If you want the key omitted entirely, disable the select or leave it without a name until a choice is made.

### Example 2: booking form with grouped fields and bounds

```html
<!-- Sends first_name, last_name, customer_email, phone, start_date,
     end_date, adults, children, hotel_id, room, breakfast, notes -->
<form action="/book" method="post">
  <fieldset>
    <legend>Guest details</legend>

    <label for="first_name">First name</label>
    <input id="first_name" name="first_name" type="text"
           autocomplete="given-name" required minlength="2">

    <label for="last_name">Last name</label>
    <input id="last_name" name="last_name" type="text"
           autocomplete="family-name" required minlength="2">

    <label for="customer_email">Email</label>
    <input id="customer_email" name="customer_email" type="email"
           autocomplete="email" required>

    <label for="phone">Phone</label>
    <input id="phone" name="phone" type="tel" autocomplete="tel"
           pattern="[0-9+ \-]{7,20}"
           title="Digits, spaces, plus, and hyphen only">
  </fieldset>

  <fieldset>
    <legend>Stay</legend>

    <label for="start_date">Arrival</label>
    <input id="start_date" name="start_date" type="date"
           min="2026-11-11" required>

    <label for="end_date">Departure</label>
    <input id="end_date" name="end_date" type="date"
           min="2026-11-12" required>

    <label for="adults">Adults</label>
    <input id="adults" name="adults" type="number"
           min="1" max="6" step="1" value="2" required>

    <label for="children">Children</label>
    <input id="children" name="children" type="number"
           min="0" max="4" step="1" value="0">
  </fieldset>

  <label for="hotel_id">Hotel</label>
  <select id="hotel_id" name="hotel_id" required>
    <option value="">Choose a hotel</option>
    <option value="1">Grand Hotel</option>
    <option value="2">Riverside Inn</option>
  </select>

  <fieldset>
    <legend>Room type</legend>
    <label><input type="radio" name="room" value="single" required> Single</label>
    <label><input type="radio" name="room" value="double" checked> Double</label>
  </fieldset>

  <label>
    <input type="checkbox" name="breakfast" value="yes">
    Breakfast included
  </label>

  <label for="notes">Notes</label>
  <textarea id="notes" name="notes" rows="4" maxlength="500"></textarea>

  <button type="submit">Book now</button>
</form>
```

Each fieldset gives the browser and the screen reader one named block. `required` on the first radio makes the whole group mandatory. The date fields carry absolute `min` values so a past arrival date cannot be submitted; the server must still reject it, because the user can edit the HTML.

### Example 3: a full profile form, commented

This one uses most of the elements you will be asked about. Read it top to bottom.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Guest profile</title>
</head>
<body>
  <h1>Guest profile</h1>

  <!--
    enctype is multipart/form-data because of the file input below.
    Without it the server receives a filename, not the image bytes.
    autocomplete="on" is inherited by every field that does not override it.
  -->
  <form id="profile" action="/profile" method="post"
        enctype="multipart/form-data" autocomplete="on">

    <!-- A hidden field travels with the form but is not shown.
         It is visible in the page source and editable with devtools,
         so it may carry a state flag, never a price or a permission. -->
    <input type="hidden" name="hotel_id" value="1">

    <fieldset>
      <legend>Identity</legend>

      <!-- id pairs with the label, name becomes the submitted key -->
      <label for="first_name">First name</label>
      <input id="first_name" name="first_name" type="text"
             autocomplete="given-name" required minlength="2" maxlength="60">

      <label for="last_name">Last name</label>
      <input id="last_name" name="last_name" type="text"
             autocomplete="family-name" required minlength="2" maxlength="60">

      <!-- Date value is always YYYY-MM-DD, whatever the visible format is -->
      <label for="birthday">Birthday</label>
      <input id="birthday" name="birthday" type="date"
             autocomplete="bday" max="2010-12-31">

      <label for="customer_email">Email</label>
      <input id="customer_email" name="customer_email" type="email"
             autocomplete="email" required>

      <!-- Passwords are masked in the UI only. HTTPS protects the wire. -->
      <label for="password">New password</label>
      <input id="password" name="password" type="password"
             autocomplete="new-password" minlength="10" required>

      <label for="phone">Phone</label>
      <input id="phone" name="phone" type="tel"
             autocomplete="tel" pattern="[0-9+ \-]{7,20}"
             title="Digits, spaces, plus, and hyphen only">
    </fieldset>

    <fieldset>
      <legend>Address</legend>

      <label for="city">City</label>
      <input id="city" name="city" type="text"
             autocomplete="address-level2" required>

      <!-- A datalist offers suggestions and still accepts free text.
           A select would forbid anything outside the list. -->
      <label for="country">Country</label>
      <input id="country" name="country" type="text"
             list="countries" autocomplete="country-name">
      <datalist id="countries">
        <option value="Hungary">
        <option value="Austria">
        <option value="Slovakia">
      </datalist>

      <label for="postal_code">Postal code</label>
      <input id="postal_code" name="postal_code" type="text"
             autocomplete="postal-code" pattern="[0-9]{4}"
             title="Four digits" inputmode="numeric">
    </fieldset>

    <fieldset>
      <legend>Preferences</legend>

      <!-- Radios share a name, so picking one clears the other.
           value is what the server sees; without it the browser sends "on". -->
      <label><input type="radio" name="contact" value="email" checked> Email me</label>
      <label><input type="radio" name="contact" value="phone"> Call me</label>

      <!-- Checkboxes with the same name send one pair per ticked box. -->
      <label><input type="checkbox" name="extras" value="breakfast"> Breakfast</label>
      <label><input type="checkbox" name="extras" value="parking"> Parking</label>

      <!-- required on a checkbox means "must be ticked", which is how
           terms and conditions consent is enforced. -->
      <label>
        <input type="checkbox" name="terms" value="accepted" required>
        I accept the booking terms
      </label>
    </fieldset>

    <fieldset>
      <legend>Photo</legend>

      <!-- accept filters the picker, it does not validate the upload.
           The server must check the real type and size. -->
      <label for="image">Profile photo</label>
      <input id="image" name="image" type="file"
             accept="image/png, image/jpeg" required>
    </fieldset>

    <label for="notes">Notes</label>
    <textarea id="notes" name="notes" rows="5" maxlength="500"
              placeholder="Allergies, late arrival, anything else"></textarea>

    <!-- type="submit" is explicit. A button inside a form defaults to submit,
         and that default has surprised every developer at least once. -->
    <button type="submit">Save profile</button>

    <!-- A second submit button with the same form, skipping validation.
         formnovalidate is per button, novalidate would disable the whole form. -->
    <button type="submit" name="intent" value="draft" formnovalidate>Save draft</button>
  </form>

  <script>
    // Custom rule the browser cannot express: the password must not contain
    // the email local part. Native validation still does the rest.
    const form = document.querySelector('#profile');
    const email = document.querySelector('#customer_email');
    const password = document.querySelector('#password');

    function syncPasswordRule() {
      const localPart = email.value.split('@')[0];
      const clash = localPart.length > 2 && password.value.includes(localPart);
      password.setCustomValidity(clash ? 'Password must not contain your email name.' : '');
    }

    email.addEventListener('input', syncPasswordRule);
    password.addEventListener('input', syncPasswordRule);

    form.addEventListener('submit', (event) => {
      if (event.submitter && event.submitter.value === 'draft') return;
      // Nothing to block: the browser already refused invalid input.
      // The listener exists only to show where server-side checks belong.
    });
  </script>
</body>
</html>
```

The profile form submits these keys: `hotel_id`, `first_name`, `last_name`, `birthday`, `customer_email`, `password`, `phone`, `city`, `country`, `postal_code`, `contact`, `extras` (possibly twice), `terms`, `image`, `notes`, and, depending on which button was used, `intent=draft`.

## Common mistakes

1. Inputs without `name`. The user types, the server receives nothing, and nobody notices until production.
2. Reusing an `id`. Every `label for` after the duplicate points at the first element, so clicking the second label focuses the wrong field.
3. Using `placeholder` instead of `label`. The name vanishes as soon as typing starts, and screen readers may skip it.
4. Forgetting `type` on a button inside a form. It defaults to `submit`, so a "show more" button sends the form.
5. Giving each radio its own `name`. They become independent checkboxes in effect, and the browser lets all of them be checked.
6. Putting `required` on a `hidden` input. Hidden controls are barred from validation, so the rule does nothing and a missing value slips through.
7. Using `disabled` for a field the server still needs. Disabled controls are not submitted; use `readonly` when the value must travel but not change.
8. Uploading a file with the default `enctype`. The server gets the filename string instead of the file.
9. Using GET for passwords, for large text, or for anything that changes state. The values land in history, logs, and referrer headers.
10. Trusting client validation. Every constraint in the HTML can be removed with devtools in five seconds.
11. Anchoring a `pattern` with `^` and `$`, or wrapping it in slashes. `pattern` is already a full match and takes neither.
12. Writing `<textarea value="...">`. The value is the text content, so this produces an empty box.
13. Reading `input.value` right after setting the `value` attribute and expecting the typed text. The attribute is the default; the property is the live value.
14. Putting a `select` inside a `label` with no visible text for the group. The whole option list becomes the label, which reads badly.
15. Forgetting `min="0"` on a number that cannot be negative. `min` defaults to nothing, so `-3` adults is accepted by the browser until the server complains.

## Exam checklist

- Can you name the default values of `method` and `enctype`?
- Do you know which controls are successful at submit time, and which three conditions remove a control from the payload?
- Can you explain the difference between `name` and `id` in one sentence each?
- Can you write a label for a text input in both the `for` form and the wrapping form?
- Do you know that radios group by `name`, and that `required` on one member requires the group?
- Can you explain why a checkbox group with the same `name` produces repeated keys?
- Can you state the value format for `date`, `time`, and `datetime-local`?
- Can you fix a number field that rejects `12.50` without `step="0.01"`?
- Do you know what `pattern` is anchored to, and which input types ignore it?
- Can you name the three `enctype` values and the one you need for uploads?
- Can you tell `form.submit()` from `form.requestSubmit()`?
- Can you name three things client validation cannot protect, and where the server check goes?
- Do you know why `:invalid` is a poor styling hook on page load?
- Can you build an accessible radio group with `fieldset`, `legend`, and one label per option?

