# required and pattern

HTML command · Forms

required blocks an empty submit, pattern checks the whole value against a regular expression. Both produce native messages before submit.

## Syntax

```html
<input required pattern="[A-Z]{2}-[0-9]{4}">
```

## Example

```html
<input type="text" name="booking_code" required
       pattern="[A-Z]{2}-[0-9]{4}"
       title="Two capitals, a dash, four digits, for example BK-0042">
<!-- pattern is anchored automatically: the whole value must match -->
```
