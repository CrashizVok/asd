# form requestSubmit()

HTML command · Form

Submits the form the way a click on a submit button would: validation runs and the submit event fires. form.submit() does neither.

## Syntax

```html
form.requestSubmit()
```

## Example

```html
<form id="profile" action="/profile" method="post">
  <label for="first_name">First name</label>
  <input id="first_name" name="first_name" type="text" required>
</form>

<button type="button" id="save">Save profile</button>

<script>
  const form = document.querySelector('#profile');
  const save = document.querySelector('#save');

  save.addEventListener('click', () => {
    // Validation runs, invalid fields block the request
    form.requestSubmit();
  });
</script>
```

## Details

`form.submit()` bypasses constraint validation and does not fire the `submit` event, which makes it the wrong tool for almost every case. `requestSubmit()` is the programmatic equivalent of pressing the submit button. Passing a submit button to it, as in `form.requestSubmit(button)`, includes that button's name and value in the payload.
