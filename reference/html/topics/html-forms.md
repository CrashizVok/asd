# Forms

HTML topic · Exam Wiki

```html
<form action="/book" method="post">
  <label for="name">Full name</label>
  <input id="name" name="name" type="text" required minlength="2">

  <label for="email">Email</label>
  <input id="email" name="email" type="email" required>

  <label for="guests">Guests</label>
  <input id="guests" name="guests" type="number" min="1" max="6" value="2">

  <label for="arrive">Arrival</label>
  <input id="arrive" name="arrive" type="date">

  <label for="room">Room type</label>
  <select id="room" name="room">
    <option value="single">Single</option>
    <option value="double" selected>Double</option>
  </select>

  <fieldset>
    <legend>Extras</legend>
    <label><input type="checkbox" name="breakfast"> Breakfast</label>
    <label><input type="radio" name="bed" value="king"> King bed</label>
    <label><input type="radio" name="bed" value="twin"> Twin beds</label>
  </fieldset>

  <label for="notes">Notes</label>
  <textarea id="notes" name="notes" rows="4"></textarea>

  <button type="submit">Book now</button>
</form>
```

Key input types: `text`, `email`, `password`, `number`, `tel`, `url`, `date`, `time`, `search`, `file`, `hidden`, `checkbox`, `radio`, `range`, `color`.

The `name` attribute is what the server receives. No `name`, no value submitted. `id` links the label to the input. `required`, `min`, `max`, `minlength`, `pattern` give free browser validation.
