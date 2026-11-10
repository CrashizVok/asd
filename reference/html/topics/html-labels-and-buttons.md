# Labels and buttons

HTML topic · Exam Wiki

```html
<label for="search">Search</label>
<input id="search" type="search">

<label>
  <input type="checkbox" name="terms" required>
  I accept the terms
</label>

<button type="button" class="btn">Filter</button>
<button type="submit" class="btn">Send</button>
<button type="reset">Clear</button>
```

Always connect a label with `for` plus matching `id`, or by wrapping the input. A label increases the click target and gives the field an accessible name. `type="button"` prevents an accidental form submit inside a form.
