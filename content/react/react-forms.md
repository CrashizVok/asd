---
id: react-forms
lang: React
title: Forms in React
override: true
---

# Forms in React

## Simplest form

```jsx
// Data shape: { email: string }
import { useState } from 'react';

function EmailForm() {
    const [email, setEmail] = useState('');

    return (
        <form>
            <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />
        </form>
    );
}
```

Three things make it work. `useState('')` starts empty. `value={email}` makes the input display what state holds. `onChange` writes each typed character back into state. Remove `value` and the input still accepts text, but React no longer has the text, so validation, reset and dependent fields have nothing to read. Remove `onChange` and the input shows a value the user cannot change.

That loop is the whole topic. A form in React is state plus inputs that read that state back. The browser already knows how to hold a typed character, and React asks you to keep the value yourself so validation, dependent fields, reset and submit all read from one place. Every field type after this is the same pattern with a different property name.

## Two ways to hold an input

- Controlled: `value` plus `onChange`. State is the single source of truth. Validation, formatting, disabling and clearing all run through state.
- Uncontrolled: `defaultValue` or nothing at all, plus a ref. The DOM holds the value and you read it on submit.

The exam default is controlled. Use uncontrolled input for a file field, because React cannot set its value, and for very large forms where a keystroke re-render costs more than it is worth. A form can mix both.

## Every part of a field

- `value` or `checked`. Which one depends on the control, not on the data. Text, email, number, select and textarea use `value`. Checkbox and radio use `checked`.
- `onChange`. Fires per keystroke for text fields and once per click for checkbox, radio and select. The argument is a React event object, and `event.target` is the DOM node.
- `event.target.value` is always a string, even for `type="number"` and `<select>`. `event.target.checked` is always a boolean.
- `name`. Gives the field an identity for a shared handler and for `FormData`. Without it, one handler cannot tell fields apart.
- `id` plus `<label htmlFor="...">`. The click target becomes the input and screen readers announce the label. A wrapping `<label>` also works and needs no id.
- `type`. `text`, `email`, `password`, `number`, `date`, `file`, `checkbox`, `radio`. It changes the mobile keyboard and the browser's own checks.
- `required`, `min`, `max`, `step`, `minLength`, `pattern`. Browser validation. It disappears when the form has `noValidate`, which is why the submit handler validates again.
- `disabled` versus `readOnly`. A disabled field cannot be focused and is not submitted. A readOnly field can be focused and copied, and it is submitted.
- `autoComplete`. Hints for the browser: `email`, `given-name`, `family-name`, `tel`, `street-address`. Exam tasks often check it on the customer fields.
- `aria-invalid` and `aria-describedby`. They tie an error message to the field for assistive technology.

## Text, email, number

Text and email hold the same kind of state, a string. Trim only for validation and keep the raw value in state, otherwise the cursor jumps while the user types a trailing space.

Email validation needs one `@`, text on both sides, and a dot after the `@`. A longer regular expression copied from somewhere is not more correct and is harder to defend in an exam.

```jsx
function validateEmail(value) {
    const email = value.trim();
    if (!email) return 'Email is required.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return 'Email looks incomplete.';
    return '';
}
```

Numbers deserve their own paragraph because the trap is quiet. `event.target.value` is a string for `type="number"` too. A cleared number field gives `''`, and `Number('')` is `0`, so a required field can look filled with a valid zero. Convert once at submit, or read `event.target.valueAsNumber`, which is `NaN` for an empty or half-typed value.

```jsx
// Keep the string in state. Convert at submit, where the check can see ''.
const [adults, setAdults] = useState('2');
const count = Number(adults); // done inside the submit handler

<input
    type="number"
    name="adults"
    min="1"
    max="6"
    value={adults}
    onChange={(event) => setAdults(event.target.value)}
/>
```

A field can also mix a text state with a numeric rule: store `'2'`, validate `Number(value)` is an integer in range, send `Number(value)`.

## Select

`value` sits on `<select>`, not on `<option>`. Each option carries a `value`, and a first option with `value=""` acts as the empty placeholder. The select then shows the placeholder whenever the state is empty.

```jsx
const [city, setCity] = useState('');

<select value={city} onChange={(event) => setCity(event.target.value)}>
    <option value="">Choose a city</option>
    <option value="Budapest">Budapest</option>
    <option value="Vienna">Vienna</option>
</select>
```

A multiple select holds an array and reads `event.target.selectedOptions`. Most exam tasks want one select or a checkbox group instead, because a multiple select is hard to use with a keyboard.

## Checkbox

One checkbox maps to a boolean, and its property is `checked`. This is the most common wrong answer on paper: `value={agree}` with `onChange={(event) => setAgree(event.target.value)}` stores the string `"on"`, and the box never reflects a programmatic change.

```jsx
<label>
    <input
        type="checkbox"
        checked={agree}
        onChange={(event) => setAgree(event.target.checked)}
    />
    I accept the terms
</label>
```

A group of checkboxes maps to an array. Add when missing, filter out when present, and build a new array each time.

```jsx
function toggle(list, value) {
    return list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value];
}

setExtras((prev) => toggle(prev, 'breakfast'));
```

## Radio

A radio group is one value shared by several inputs. Every radio in the group carries the same `name`, and each one is checked when the state equals its own value. Clicking a radio never clears the group, which is the point of radio over checkbox.

```jsx
{['single', 'double', 'suite'].map((type) => (
    <label key={type}>
        <input
            type="radio"
            name="room_type"
            value={type}
            checked={roomType === type}
            onChange={(event) => setRoomType(event.target.value)}
        />
        {type}
    </label>
))}
```

Cards drawn as radio choices keep the real input and hide it visually with CSS. Replacing it with clickable divs loses the keyboard and the group semantics.

## Textarea

`value` goes on the `<textarea>` element, never between the tags. In plain HTML the value is the child text. In JSX, children become the initial content and React warns about a controlled textarea with children.

```jsx
<textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} />
```

## Multiple fields

Separate state per field is clearest up to about four fields. Past that, one object plus a handler keyed by `name`:

```jsx
const [form, setForm] = useState({ first_name: '', last_name: '', phone: '' });

function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
}

<input name="first_name" value={form.first_name} onChange={handleChange} />
<input name="last_name" value={form.last_name} onChange={handleChange} />
```

The computed key requires every input to carry a `name`. A field without `name` writes `undefined` as a key and does nothing visible, which is a slow bug to find. For a nested object, spread at every level. For a list of rows, map with the index and replace that index:

```jsx
setRows((prev) => prev.map((row, i) => (i === index ? { ...row, name: value } : row)));
```

A form with many transitions, such as add row, remove row, reset and edit, is a good fit for `useReducer`, but `useState` with spreads is the expected exam answer.

## Validation

Validate in a pure function: values in, errors object out. The same input always gives the same errors, so it can be tested without rendering the form.

```jsx
function validate(form) {
    const errors = {};
    if (!form.customer_email.trim()) errors.customer_email = 'Email is required.';
    if (!form.first_name.trim()) errors.first_name = 'First name is required.';
    if (Number(form.adults) < 1) errors.adults = 'At least one adult.';
    return errors;
}
```

Three moments to run it. On submit, always. On blur, when the user leaves a field. On change, but only after the first failed submit, so the form does not shout at someone halfway through typing an address. The exam answer is submit-only unless the task asks for live validation.

Good error text says what to do. "Email looks incomplete" beats "Invalid input", and "Phone needs at least 7 digits" beats "Error".

## Submit

`event.preventDefault()` is the first line of the submit handler. Without it the browser sends a GET request with the field values, the page reloads, and every piece of React state is gone.

`onSubmit` belongs on the `<form>`. A click handler on the button misses the Enter key inside a text field.

An async handler disables the button while the request runs, otherwise an impatient double click posts twice.

```jsx
async function handleSubmit(event) {
    event.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    try {
        await onSave(form);
    } finally {
        setSaving(false);
    }
}
```

`noValidate` on the form turns off the browser bubbles, so your own messages are the only ones shown. Leaving browser validation on is fine for a small form with no custom messages, but then the submit handler can run with values the browser already accepted.

Read `event.target.value` before the first `await`. The event object survives in modern React, but the DOM node may be gone by the time a long request returns, and the read then fails.

## Reset

Three cases, and only one of them is the obvious one.

1. Controlled form. Clearing state is the reset. `form.reset()` and `<button type="reset">` restore the HTML defaults only, and the next render puts the state value back, so the fields visibly snap back.
2. Uncontrolled form. `form.reset()` is enough, plus clearing whatever refs you read.
3. Fresh mount. A changing `key` on the form throws the subtree away and every input is born empty. Useful when the form edits a record that the user can swap.

A file input is always uncontrolled, so it needs a ref even inside a controlled form: `fileRef.current.value = ''`.

```jsx
function resetFields() {
    setForm(EMPTY_FORM);
    setErrors({});
    if (fileRef.current) fileRef.current.value = '';
}
```

## File input

`<input type="file">` cannot be controlled. React cannot set `value` and `files` is read only, so the browser owns it. Read `event.target.files`, which is a `FileList`; take `files[0]`, or convert with `Array.from` when several files are allowed. Send it as `FormData`, not as JSON. `accept` filters the picker, and it is only a hint, so check the type and the size in code.

```jsx
const [image, setImage] = useState(null);

<input
    ref={fileRef}
    type="file"
    accept="image/*"
    onChange={(event) => setImage(event.target.files[0] ?? null)}
/>
```

## Errors

Show the message next to the field, not only at the top of the page. On the input set `aria-invalid` when it has an error, and `aria-describedby` pointing at the message id. After a failed submit, move focus to the first invalid field; on a long form the user otherwise scrolls looking for red text. Colour alone leaves out colour blind users, so pair it with words or an icon. A short summary with the number of problems helps on a form longer than a screen.

## Examples

### Example 1: newsletter form with a consent checkbox

```jsx
import { useState } from 'react';

function Newsletter() {
    const [email, setEmail] = useState('');
    const [consent, setConsent] = useState(false);
    const [message, setMessage] = useState('');

    // Validation lives here because the messages depend on two fields, not one.
    function handleSubmit(event) {
        event.preventDefault();
        const clean = email.trim();

        if (!clean.includes('@') || !clean.includes('.')) {
            setMessage('Enter a valid email address.');
            return;
        }
        if (!consent) {
            setMessage('Tick the consent box first.');
            return;
        }

        setMessage('Subscribed: ' + clean);
        setEmail('');       // a controlled form clears through state
        setConsent(false);
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="news-email">Email</label>
            <input
                id="news-email"
                name="customer_email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
            />

            <label>
                <input
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => setConsent(event.target.checked)}
                />
                Send me the monthly offer
            </label>

            <button type="submit">Subscribe</button>
            {message && <p role="status">{message}</p>}
        </form>
    );
}

export default Newsletter;
```

### Example 2: room search with select and number

```jsx
import { useState } from 'react';

const CITIES = ['Budapest', 'Vienna', 'Prague'];

function RoomSearch({ onSearch }) {
    const [city, setCity] = useState('');
    const [adults, setAdults] = useState('2');
    const [checkIn, setCheckIn] = useState('');
    const [error, setError] = useState('');

    function handleSubmit(event) {
        event.preventDefault();

        // Convert here, not in onChange, so an empty field can be detected.
        const count = Number(adults);
        if (!city) {
            setError('Choose a city.');
            return;
        }
        if (!Number.isInteger(count) || count < 1 || count > 6) {
            setError('Adults must be a whole number from 1 to 6.');
            return;
        }

        setError('');
        onSearch({ city, adults: count, start_date: checkIn });
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="city">City</label>
            <select
                id="city"
                name="city"
                value={city}
                onChange={(event) => setCity(event.target.value)}
            >
                <option value="">Choose a city</option>
                {CITIES.map((item) => (
                    <option key={item} value={item}>{item}</option>
                ))}
            </select>

            <label htmlFor="adults">Adults</label>
            <input
                id="adults"
                name="adults"
                type="number"
                min="1"
                max="6"
                value={adults}
                onChange={(event) => setAdults(event.target.value)}
            />

            <label htmlFor="start_date">Check in</label>
            <input
                id="start_date"
                name="start_date"
                type="date"
                value={checkIn}
                onChange={(event) => setCheckIn(event.target.value)}
            />

            <button type="submit">Search</button>
            {error && <p role="alert">{error}</p>}
        </form>
    );
}

export default RoomSearch;
```

### Example 3: full booking form, one object and one handler

This is the shape an exam task usually asks for. Read it from top to bottom: constants, the empty form, the validator, the component state, the handlers, the JSX.

```jsx
import { useRef, useState } from 'react';

// Fixed lists. In a real app these arrive from the API.
const HOTELS = [
    { id: 'h1', name: 'Danube View' },
    { id: 'h2', name: 'Buda Hills' },
];
const ROOM_TYPES = ['single', 'double', 'suite'];
const EXTRAS = ['breakfast', 'parking', 'late checkout'];

// One object for the whole form. Numbers stay strings here and are converted
// at submit. The checkbox group is an array, terms is a boolean.
const EMPTY_FORM = {
    customer_email: '',
    first_name: '',
    last_name: '',
    phone: '',
    birthday: '',
    hotel_id: '',
    city: '',
    adults: '2',
    children: '0',
    room_type: 'double',
    extras: [],
    notes: '',
    terms: false,
};

// Pure validator: values in, errors out. No React inside, so it is easy to test.
function validate(form) {
    const errors = {};
    const email = form.customer_email.trim();

    if (!email) {
        errors.customer_email = 'Email is required.';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        errors.customer_email = 'Email looks incomplete.';
    }

    if (!form.first_name.trim()) errors.first_name = 'First name is required.';
    if (!form.last_name.trim()) errors.last_name = 'Last name is required.';

    if (!form.phone.trim()) {
        errors.phone = 'Phone is required.';
    } else if (form.phone.replace(/\D/g, '').length < 7) {
        errors.phone = 'Phone needs at least 7 digits.';
    }

    if (!form.hotel_id) errors.hotel_id = 'Choose a hotel.';
    if (!form.city.trim()) errors.city = 'City is required.';

    const adults = Number(form.adults);
    if (!Number.isInteger(adults) || adults < 1 || adults > 6) {
        errors.adults = 'Adults must be a whole number from 1 to 6.';
    }

    const children = Number(form.children);
    if (!Number.isInteger(children) || children < 0) {
        errors.children = 'Children cannot be negative.';
    }

    if (!form.terms) errors.terms = 'Accept the terms to continue.';

    return errors;
}

function BookingForm({ onSave }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('');
    const [saving, setSaving] = useState(false);
    const [image, setImage] = useState(null);
    const formRef = useRef(null);
    const fileRef = useRef(null);

    // One handler for text, email, number, date, select and the single checkbox.
    // name picks the key, type picks the property to read.
    function handleChange(event) {
        const { name, type, value, checked } = event.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }

    // Checkbox group: build a new array, never push into the old one.
    function handleExtra(event) {
        const { value, checked } = event.target;
        setForm((prev) => ({
            ...prev,
            extras: checked
                ? [...prev.extras, value]
                : prev.extras.filter((item) => item !== value),
        }));
    }

    // File input is uncontrolled, so the File gets its own state entry.
    function handleFile(event) {
        setImage(event.target.files[0] ?? null);
    }

    // After a failed submit, put the cursor where the first problem is.
    function focusFirstError(found) {
        const first = Object.keys(found)[0];
        if (!first) return;
        const field = formRef.current?.querySelector('[name="' + first + '"]');
        if (field) field.focus();
    }

    function resetFields() {
        setForm(EMPTY_FORM);
        setErrors({});
        setImage(null);
        // The only value React cannot clear for us.
        if (fileRef.current) fileRef.current.value = '';
    }

    async function handleSubmit(event) {
        event.preventDefault(); // keep the page, keep the state

        const found = validate(form);
        setErrors(found);

        if (Object.keys(found).length > 0) {
            setStatus('');
            focusFirstError(found);
            return;
        }

        setSaving(true);
        setStatus('Saving...');

        try {
            // The caller gets numbers for numbers and a File for image.
            await onSave({
                ...form,
                adults: Number(form.adults),
                children: Number(form.children),
                image,
            });
            resetFields();
            setStatus('Booking saved.');
        } catch (error) {
            setStatus(error.message || 'Saving failed.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit} noValidate>
            <h2>Book a room</h2>

            {Object.keys(errors).length > 0 && (
                <p role="alert">
                    {Object.keys(errors).length} field(s) need attention.
                </p>
            )}

            <label htmlFor="customer_email">Email</label>
            <input
                id="customer_email"
                name="customer_email"
                type="email"
                value={form.customer_email}
                onChange={handleChange}
                autoComplete="email"
                aria-invalid={Boolean(errors.customer_email)}
                aria-describedby={errors.customer_email ? 'customer_email_error' : undefined}
            />
            {errors.customer_email && (
                <p id="customer_email_error">{errors.customer_email}</p>
            )}

            <label htmlFor="first_name">First name</label>
            <input
                id="first_name"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                autoComplete="given-name"
            />
            {errors.first_name && <p>{errors.first_name}</p>}

            <label htmlFor="last_name">Last name</label>
            <input
                id="last_name"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                autoComplete="family-name"
            />
            {errors.last_name && <p>{errors.last_name}</p>}

            <label htmlFor="phone">Phone</label>
            <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
            />
            {errors.phone && <p>{errors.phone}</p>}

            <label htmlFor="birthday">Birthday</label>
            <input
                id="birthday"
                name="birthday"
                type="date"
                value={form.birthday}
                onChange={handleChange}
            />

            <label htmlFor="hotel_id">Hotel</label>
            <select
                id="hotel_id"
                name="hotel_id"
                value={form.hotel_id}
                onChange={handleChange}
            >
                <option value="">Choose a hotel</option>
                {HOTELS.map((hotel) => (
                    <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                ))}
            </select>
            {errors.hotel_id && <p>{errors.hotel_id}</p>}

            <label htmlFor="city">City</label>
            <input
                id="city"
                name="city"
                value={form.city}
                onChange={handleChange}
            />
            {errors.city && <p>{errors.city}</p>}

            <label htmlFor="adults">Adults</label>
            <input
                id="adults"
                name="adults"
                type="number"
                min="1"
                max="6"
                value={form.adults}
                onChange={handleChange}
            />
            {errors.adults && <p>{errors.adults}</p>}

            <label htmlFor="children">Children</label>
            <input
                id="children"
                name="children"
                type="number"
                min="0"
                value={form.children}
                onChange={handleChange}
            />
            {errors.children && <p>{errors.children}</p>}

            <fieldset>
                <legend>Room type</legend>
                {ROOM_TYPES.map((type) => (
                    <label key={type}>
                        <input
                            type="radio"
                            name="room_type"
                            value={type}
                            checked={form.room_type === type}
                            onChange={handleChange}
                        />
                        {type}
                    </label>
                ))}
            </fieldset>

            <fieldset>
                <legend>Extras</legend>
                {EXTRAS.map((extra) => (
                    <label key={extra}>
                        <input
                            type="checkbox"
                            name="extras"
                            value={extra}
                            checked={form.extras.includes(extra)}
                            onChange={handleExtra}
                        />
                        {extra}
                    </label>
                ))}
            </fieldset>

            <label htmlFor="notes">Notes</label>
            <textarea
                id="notes"
                name="notes"
                rows={4}
                value={form.notes}
                onChange={handleChange}
            />

            <label htmlFor="image">Room photo</label>
            <input
                ref={fileRef}
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleFile}
            />
            {image && <p>Selected: {image.name}</p>}

            <label>
                <input
                    type="checkbox"
                    name="terms"
                    checked={form.terms}
                    onChange={handleChange}
                />
                I accept the terms
            </label>
            {errors.terms && <p>{errors.terms}</p>}

            <button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save booking'}
            </button>
            <button type="button" onClick={() => { resetFields(); setStatus(''); }}>
                Reset
            </button>

            {status && <p role="status">{status}</p>}
        </form>
    );
}

export default BookingForm;
```

## Common mistakes

- `value` without `onChange`. The field looks normal and ignores the keyboard, and React logs a warning about a read-only field.
- `onChange` without `value`. The field accepts text, but state and screen drift apart. That is an uncontrolled field with a handler.
- Checkbox written with `value` and `event.target.value`. It stores `"on"` and never reflects a programmatic change. Use `checked` and `event.target.checked`.
- Radio buttons without a shared `name`, or checked with a truthy value instead of `roomType === type`. Two radios then stay selected.
- `value` placed on `<option>` instead of `<select>`.
- Textarea filled through children. `value` belongs on the element.
- Number converted in `onChange` with `Number(event.target.value)`. An empty field becomes `0`, and the required check silently passes.
- Missing `event.preventDefault()`. The page reloads and the form empties, which looks like a reset bug.
- `onClick` on the submit button instead of `onSubmit` on the form. Pressing Enter bypasses it.
- Clearing with `form.reset()` only. The controlled inputs render their state back, so nothing appears to happen.
- Mutating state: `prev.extras.push(value)`, or assigning `form.city = value`. React sees the same object and skips the render.
- Errors shown only under the field, with no `aria-invalid`, no `aria-describedby`, and no focus move. Screen reader users cannot find them.
- Disabling the submit button as the only check. A disabled button explains nothing, and a keyboard user gets stuck with no message.
- A label without `htmlFor` and without wrapping the input, so clicking the text does nothing.
- File input given a `value` prop, or a File object put into JSON with `JSON.stringify`. Use `FormData`.

## Exam checklist

- Every controlled field has `value` and `onChange`; every checkbox and radio has `checked` and `onChange`.
- The right property is read: `event.target.value` for text, select, textarea and number; `event.target.checked` for checkbox and radio.
- Number and date fields stay strings in state until the submit handler converts them.
- Every field that a shared handler touches has a `name`.
- The submit handler starts with `event.preventDefault()` and lives on `<form onSubmit>`.
- Validation is a function that takes values and returns an errors object, empty when the input is valid.
- Errors render next to their fields, with text, not colour alone.
- Reset clears state, and also clears the file input through a ref.
- The file input has no `value`, reads `event.target.files[0]`, and is sent as `FormData`.
- The submit button is disabled while a request is running, so a double click cannot post twice.
- Labels are attached with `htmlFor` and `id`, or by wrapping the input.
- Mapped radios and checkboxes have a stable `key`, and the form has no console warnings.
