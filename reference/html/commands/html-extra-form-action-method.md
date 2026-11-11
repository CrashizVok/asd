# action and method

HTML command · Forms

action is the URL that receives the data, method decides how. GET puts fields in the query string, POST sends them in the request body.

## Syntax

```html
<form action="/bookings" method="post">
```

## Example

```html
<!-- search is safe to repeat, so GET and a visible query -->
<form action="/search" method="get">
  <input name="city" value="Budapest">
</form>

<!-- creating a booking changes data, so POST -->
<form action="/bookings" method="post">
  <input type="hidden" name="hotel_id" value="42">
</form>
<!-- never use GET for passwords, the URL is logged and kept in history -->
```
