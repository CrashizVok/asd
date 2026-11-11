# onsubmit

HTML command · Events

Fires when a form is submitted, whether by button or Enter. Returning false from an inline handler stops the navigation.

## Syntax

```html
<form onsubmit="return validate()">
```

## Example

```html
<form action="/bookings" method="post" onsubmit="return checkDates()">
  <input type="date" name="start_date" id="start_date">
  <input type="date" name="end_date" id="end_date">
  <button>Book</button>
</form>

<script>
  function checkDates() {
    const start = document.getElementById('start_date').value;
    const end = document.getElementById('end_date').value;
    if (start && end && end < start) {
      alert('End date is before start date');
      return false; // block the request
    }
    return true;
  }
</script>
```
