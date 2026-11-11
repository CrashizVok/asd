# HTML input types

HTML topic · Exam Wiki

## Simplest form

```html
<!-- Data shape sent to the server: { first_name: "Ada", customer_email: "ada@example.com" } -->
<form action="/customers" method="post">
  <label for="first_name">First name</label>
  <input id="first_name" name="first_name" type="text">

  <label for="customer_email">Email</label>
  <input id="customer_email" name="customer_email" type="email">

  <button type="submit">Save</button>
</form>
```

If you leave `type` out, the browser treats the input as `text`. Write it anyway. The type is the only thing that decides which keyboard a phone shows, which validation runs, and which widget the browser paints.

## What the type actually changes

A `type` value changes four things, and the server receives a string in every case except `file`:

- the widget, so a date field gets a calendar and a range gets a slider,
- the on-screen keyboard on touch devices,
- the validation the browser applies before submission,
- the format of the value, for example `YYYY-MM-DD` for a date.

An unknown type falls back to `text` with no error. Typing `type="emial"` gives you a plain text box that accepts anything, which is why typos here are quiet and expensive.

The value formats are fixed, not locale dependent. A user in Hungary may see `2026. 11. 11.` in the widget, and the DOM still holds `2026-11-11`. Never parse the visible format.

## Text-like types

`text` is the default. It takes any string, and `minlength`, `maxlength`, and `pattern` all apply.

`email` checks for an `@` and a plausible domain part. The browser's check is deliberately loose, so `a@b` passes. It catches typing mistakes, not invalid mailboxes. `multiple` allows a comma separated list.

`password` masks the characters. Masking is shoulder-surfing protection, not encryption; the value travels in clear text unless the page is served over HTTPS. It also has no `minlength` protection from the browser beyond what you declare.

`search` renders like text and may add a clear button. It is a semantic hint, with no extra validation.

`tel` applies no validation at all, because phone number formats differ by country. Pair it with `pattern` and `inputmode="tel"` if you need a shape.

`url` requires a scheme such as `https://`. Typing `example.com` fails validation, which surprises people.

```html
<label for="site">Website</label>
<input id="site" name="site" type="url" placeholder="https://example.com">
```

`placeholder` belongs to these text-like types. On `number` its support is inconsistent, and on `date` and `color` it is meaningless. It never replaces a label.

## Number and range

`number` gives a spinner and numeric validation. Its value is still a string, and `step` defaults to `1`, so `step="0.01"` is required for prices and `step="any"` removes the grid. The browser accepts exponent notation while typing, so `2e3` is a legal value. Read it with `valueAsNumber` when you need a number.

```html
<label for="adults">Adults</label>
<input id="adults" name="adults" type="number" min="1" max="6" step="1" value="2">
```

Do not use `number` for phone numbers, card numbers, postal codes, or one-time codes. Leading zeros are stripped, and the up and down arrows make no sense for those values. Use `type="text"` with `inputmode="numeric"` and a `pattern`.

`range` is a slider. It always has a value, defaulting to the midpoint of `min` and `max`, so `required` on it does nothing. It is for coarse choices such as a price filter, not for exact input. Pair it with `<output>` so the current value is visible.

```html
<label for="max_price">Maximum price</label>
<input id="max_price" name="max_price" type="range"
       min="40" max="300" step="10" value="120">
<output for="max_price">120</output>
```

## Date and time types

Each one has an exact value format:

- `date` gives `YYYY-MM-DD`,
- `time` gives `HH:mm`, or `HH:mm:ss` when a step in seconds is set,
- `datetime-local` gives `YYYY-MM-DDTHH:mm`,
- `month` gives `YYYY-MM`,
- `week` gives `YYYY-Www`, for example `2026-W45`.

`min` and `max` use the same format. For `time`, `step` counts seconds. None of these carry a timezone; `datetime-local` is a wall clock reading, so the server must decide which zone it belongs to.

```html
<label for="arrive">Arrival</label>
<input id="arrive" name="arrive" type="date" min="2026-11-11" max="2027-12-31">
```

Browser support for the widget varies, and a browser without one falls back to a text box that still validates. The stored value is the same either way.

## Checkbox and radio

A checkbox is independent. Its submitted value is its `value` attribute, or the string `on` when the attribute is missing. Several checkboxes with the same `name` send repeated keys, which is the standard way to collect a multi-choice answer.

```html
<label><input type="checkbox" name="extras" value="breakfast" checked> Breakfast</label>
<label><input type="checkbox" name="extras" value="parking"> Parking</label>
```

A radio is one of a group. The group is defined by a shared `name`, and checking one unchecks the rest. Without a `value`, a radio sends `on` as well, so always give each radio a meaningful value. One member with `required` makes the group mandatory.

```html
<fieldset>
  <legend>Contact method</legend>
  <label><input type="radio" name="contact" value="email" checked> Email</label>
  <label><input type="radio" name="contact" value="phone"> Phone</label>
</fieldset>
```

`required` on a checkbox means it must be ticked. That is the usual mechanism behind terms and conditions consent, and it needs a server check too because devtools can remove the attribute.

## File and colour

`file` opens the system picker. `accept` filters the dialog and is a hint, not a security control; the server must verify the real content type and size. `multiple` allows more than one file, and the form then needs `enctype="multipart/form-data"`. A script cannot set the value to a local path, and reading `value` gives a fake path such as `C:\fakepath\room.jpg`, which is useless for display. Use `input.files` instead.

```html
<label for="image">Room photo</label>
<input id="image" name="image" type="file" accept="image/png, image/jpeg" multiple>
```

`color` renders a colour picker and returns a lowercase `#rrggbb` string. It defaults to `#000000`. There is no alpha channel in the value, and typing a colour name is not possible.

## Buttons and hidden

`submit` sends the form and contributes its own name and value when it has both. That is the clean way to have "Save" and "Delete" in one form without JavaScript.

`button` renders a button with no default action. Inside a form it is the safe type for anything that should not submit.

`reset` restores every field to its initial value. Users hate it, and it destroys typed data with one click. Avoid it.

`image` is a submit button drawn as an image. It sends `name.x` and `name.y` coordinates in addition to the usual payload, which is a detail exams like.

`hidden` is not shown, is not validated, and is fully visible in the page source. It is fine for a state flag or a CSRF token, never for a price, a role, or anything the user must not control.

`submit`, `reset`, `button`, and `image` honour per-button overrides: `formaction`, `formmethod`, `formenctype`, `formnovalidate`, and `formtarget`. A "Save draft" button can therefore post to a different URL and skip validation while sitting inside the same form.

```html
<button type="submit" name="intent" value="publish">Publish</button>
<button type="submit" name="intent" value="draft"
        formaction="/drafts" formnovalidate>Save draft</button>
```

## Attributes each type ignores

Not every attribute applies everywhere, and a silent no-op is worse than an error.

- `pattern` does nothing on `number`, `range`, `date`, `time`, `color`, `checkbox`, `radio`, `file`, `hidden`, and the button types.
- `minlength` and `maxlength` do nothing on `number`, `date`, `range`, `checkbox`, `radio`, `file`, and the buttons. Use `min` and `max` for numbers and dates.
- `readonly` does nothing on `checkbox`, `radio`, `file`, `range`, `color`, and the buttons. A readonly control is still submitted.
- `required` has no effect on `hidden` (barred from validation) and no practical effect on `range` or `color` (they always have a value).
- `placeholder` is meaningless on `checkbox`, `radio`, `file`, `range`, `color`, and the date family.
- `multiple` only applies to `email`, `file`, and `select`.

## Accessibility notes

Every control needs a programmatic name. A visible `<label>` paired with `id` is the default answer; `aria-label` is the fallback when the design truly has no room for text.

Group radios and related checkboxes in `fieldset` with a `legend`. A screen reader announces the legend when focus enters the group, which is the only way a user knows what "Yes" and "No" refer to.

Hints and errors should be connected with `aria-describedby`, not just placed nearby:

```html
<label for="phone">Phone</label>
<input id="phone" name="phone" type="tel" aria-describedby="phone_hint"
       pattern="[0-9+ \-]{7,20}">
<p id="phone_hint">Include the country code, for example +36 1 234 5678.</p>
```

Pick the right `autocomplete` token and the right `inputmode`. Both reduce typing, which is the largest accessibility win on a phone. And never rely on colour alone to show an error.

## Examples

### Example 1: contact details with the right types

```html
<!-- Sends name, customer_email, phone, site -->
<form action="/contact" method="post">
  <label for="name">Name</label>
  <input id="name" name="name" type="text"
         autocomplete="name" required maxlength="80">

  <label for="customer_email">Email</label>
  <input id="customer_email" name="customer_email" type="email"
         autocomplete="email" required>

  <label for="phone">Phone</label>
  <input id="phone" name="phone" type="tel"
         autocomplete="tel" inputmode="tel" pattern="[0-9+ \-]{7,20}">

  <label for="site">Website</label>
  <input id="site" name="site" type="url"
         autocomplete="url" placeholder="https://example.com">

  <button type="submit">Send</button>
</form>
```

The email field gets the email keyboard and a basic shape check. The phone field gets the telephone keypad and your own pattern. The URL field refuses anything without a scheme.

### Example 2: stay dates, guests, and a price slider

```html
<!-- Sends start_date, end_date, arrive_time, adults, children, max_price -->
<form action="/search" method="get">
  <label for="start_date">Arrival date</label>
  <input id="start_date" name="start_date" type="date"
         min="2026-11-11" value="2026-11-11" required>

  <label for="end_date">Departure date</label>
  <input id="end_date" name="end_date" type="date"
         min="2026-11-12" value="2026-11-14" required>

  <label for="arrive_time">Arrival time</label>
  <input id="arrive_time" name="arrive_time" type="time"
         min="06:00" max="23:00" step="900">

  <label for="adults">Adults</label>
  <input id="adults" name="adults" type="number"
         min="1" max="6" step="1" value="2" required>

  <label for="children">Children</label>
  <input id="children" name="children" type="number"
         min="0" max="4" step="1" value="0">

  <label for="max_price">Maximum price per night</label>
  <input id="max_price" name="max_price" type="range"
         min="40" max="300" step="10" value="120">
  <output for="max_price">120 EUR</output>

  <button type="submit">Search</button>
</form>
```

`step="900"` on the time field means quarter hours, because 900 seconds is 15 minutes. The range always submits a value, so `required` would add nothing. The output element needs a small script to stay in sync, shown in the next example.

### Example 3: every input type in one commented form

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Guest preferences</title>
</head>
<body>
  <h1>Guest preferences</h1>

  <!-- multipart is required because of the file input further down -->
  <form id="prefs" action="/preferences" method="post"
        enctype="multipart/form-data">

    <fieldset>
      <legend>Account</legend>

      <!-- text: any string, safe default -->
      <label for="first_name">First name</label>
      <input id="first_name" name="first_name" type="text"
             autocomplete="given-name" required minlength="2">

      <!-- email: shape check plus the email keyboard -->
      <label for="customer_email">Email</label>
      <input id="customer_email" name="customer_email" type="email"
             autocomplete="email" required>

      <!-- password: masked only, no validation beyond what you add -->
      <label for="password">Password</label>
      <input id="password" name="password" type="password"
             autocomplete="new-password" minlength="10" required>

      <!-- search: text with a clear button in some browsers -->
      <label for="q">Saved search name</label>
      <input id="q" name="q" type="search" placeholder="Sea view">

      <!-- tel: no built-in validation, so the pattern carries the rule -->
      <label for="phone">Phone</label>
      <input id="phone" name="phone" type="tel" autocomplete="tel"
             inputmode="tel" pattern="[0-9+ \-]{7,20}"
             title="Digits, spaces, plus, and hyphen only">

      <!-- url: rejects values without a scheme -->
      <label for="site">Website</label>
      <input id="site" name="site" type="url"
             placeholder="https://example.com">
    </fieldset>

    <fieldset>
      <legend>Stay</legend>

      <!-- date: DOM value is always YYYY-MM-DD -->
      <label for="birthday">Birthday</label>
      <input id="birthday" name="birthday" type="date" autocomplete="bday">

      <!-- time: HH:mm unless a step introduces seconds -->
      <label for="arrive_time">Preferred arrival time</label>
      <input id="arrive_time" name="arrive_time" type="time"
             min="06:00" max="23:00" step="900">

      <!-- datetime-local: wall clock, no timezone in the value -->
      <label for="picked_up">Pickup</label>
      <input id="picked_up" name="picked_up" type="datetime-local"
             min="2026-11-11T06:00" max="2026-11-30T23:00">

      <!-- month: YYYY-MM -->
      <label for="card_expiry">Card expiry</label>
      <input id="card_expiry" name="card_expiry" type="month"
             min="2026-11" max="2035-12">

      <!-- week: YYYY-Www, rarely the right choice for users -->
      <label for="travel_week">Travel week</label>
      <input id="travel_week" name="travel_week" type="week"
             min="2026-W45" max="2027-W10">

      <!-- number: string value, step defaults to 1, leading zeros lost -->
      <label for="adults">Adults</label>
      <input id="adults" name="adults" type="number"
             min="1" max="6" step="1" value="2" required>

      <!-- range: always has a value, so required is pointless here -->
      <label for="max_price">Maximum price per night</label>
      <input id="max_price" name="max_price" type="range"
             min="40" max="300" step="10" value="120">
      <output id="price_out" for="max_price">120 EUR</output>

      <!-- color: lowercase #rrggbb, no alpha channel -->
      <label for="tag_color">Luggage tag colour</label>
      <input id="tag_color" name="tag_color" type="color" value="#2f6f4e">
    </fieldset>

    <fieldset>
      <legend>Preferences</legend>

      <!-- radios group by name, one value each, one default ticked -->
      <label><input type="radio" name="room" value="single" checked> Single room</label>
      <label><input type="radio" name="room" value="double"> Double room</label>

      <!-- checkboxes with the same name send repeated pairs -->
      <label><input type="checkbox" name="extras" value="breakfast"> Breakfast</label>
      <label><input type="checkbox" name="extras" value="parking" checked> Parking</label>

      <!-- required checkbox is the consent pattern -->
      <label>
        <input type="checkbox" name="terms" value="accepted" required>
        I accept the house rules
      </label>
    </fieldset>

    <fieldset>
      <legend>Documents</legend>

      <!-- file: accept is a filter, not a check; multiple allows a list -->
      <label for="image">Passport photo</label>
      <input id="image" name="image" type="file"
             accept="image/png, image/jpeg" multiple>

      <!-- hidden: invisible to the user, visible in the source, not validated -->
      <input type="hidden" name="hotel_id" value="1">
    </fieldset>

    <label for="notes">Notes</label>
    <!-- textarea is not an input and has no value attribute -->
    <textarea id="notes" name="notes" rows="4" maxlength="500"></textarea>

    <!-- two submits, one payload; the clicked button adds its own pair -->
    <button type="submit" name="intent" value="publish">Save preferences</button>
    <button type="submit" name="intent" value="draft"
            formaction="/preferences/draft" formnovalidate>Save draft</button>

    <!-- reset throws away everything the user typed, so it is commented out
    <button type="reset">Clear form</button>
    -->
  </form>

  <script>
    // Keep the output text in step with the slider.
    const price = document.querySelector('#max_price');
    const out = document.querySelector('#price_out');

    price.addEventListener('input', () => {
      out.textContent = `${price.value} EUR`;
    });

    // number values are strings; valueAsNumber gives the numeric form
    const adults = document.querySelector('#adults');
    adults.addEventListener('change', () => {
      console.log(adults.valueAsNumber + 1);
    });
  </script>
</body>
</html>
```

Read the comments as the map: each block names one type, its value shape, and the attribute that actually does something for that type.

### Example 4: a verification code that must stay text

```html
<!-- Sends code as a string, so a leading zero survives -->
<form action="/verify" method="post">
  <label for="code">Six digit code</label>
  <input id="code" name="code" type="text"
         inputmode="numeric" pattern="[0-9]{6}"
         maxlength="6" autocomplete="one-time-code"
         title="Six digits" required>

  <button type="submit">Verify</button>
</form>
```

`type="number"` here would strip `012345`, accept `1e5`, and add spinner arrows nobody wants. Text plus `inputmode` plus `pattern` gives the numeric keypad and keeps the leading zero.

## Common mistakes

1. Trusting `type="email"` to validate an address properly. It only checks for an `@` and something after it.
2. Using `type="number"` for phone numbers, card numbers, postal codes, or codes with leading zeros.
3. Forgetting `step="0.01"` and then wondering why `12.50` is rejected or rounded.
4. Expecting `pattern` on `type="number"` or `type="date"` to work. It is ignored there.
5. Writing `pattern="/^\d{3}$/"`. No slashes, no anchors, and `\d` must survive as `[0-9]` if the attribute is generated.
6. Giving radios no `value`, so every submission carries `on` and the server cannot tell the options apart.
7. Grouping radios by fieldset instead of by `name`. The fieldset labels the group, it does not join it.
8. Using `required` on a `range` or `color` field. Both always have a value, so the constraint is a no-op.
9. Using `required` on a `hidden` input. Hidden controls are skipped by validation.
10. Setting `readonly` on a checkbox and expecting the value to be protected. It does nothing there; use `disabled` and add a hidden field if the value must still travel.
11. Uploading without `enctype="multipart/form-data"`, then reading a filename where the bytes should be.
12. Reading `file.value` and getting `C:\fakepath\...`. Use `file.files`.
13. Parsing `input.value` as a number for `number` fields. It is a string, and `2e3` is legal. Use `valueAsNumber`.
14. Leaving out the label because the placeholder "looks fine". The field loses its name on the first keystroke and for screen readers.
15. Relying on `min` and `max` for `date` without a server check. The attributes are only a hint to the browser.

## Exam checklist

- Can you name the four things an input `type` changes?
- Do you know the default type, and what happens with an unknown type?
- Can you list the value formats for `date`, `time`, `datetime-local`, `month`, and `week`?
- Can you say why `type="number"` is wrong for an OTP and what the replacement is?
- Do you know the default `step` for `number`, and how to allow two decimals?
- Can you explain why `required` has no effect on `range` and `color`?
- Can you build a radio group that is both functional and accessible, naming the two attributes that matter most?
- Do you know what value a checkbox or radio submits when it has no `value` attribute?
- Can you state which two types need `enctype="multipart/form-data"` style handling?
- Can you name three attributes that `pattern` does not work with, and the attribute to use instead for numbers and dates?
- Can you describe what `accept` does and does not guarantee?
- Can you explain the difference between `disabled` and `readonly` in terms of submission and validation?
- Do you know which attributes a button can override per click, and why that is useful?
- Can you choose the right `autocomplete` token for an email, a phone, and a birthday?

