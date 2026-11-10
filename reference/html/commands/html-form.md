# <form>

HTML command · Forms

Collects and sends user input. action is the URL, method is get or post.

## Syntax

```html
<form action="/submit" method="post">...</form>
```

## Example

```html
<form action="/api/customer" method="post">
  <label>Email <input type="email" name="email" required></label>
  <button type="submit">Save</button>
</form>
```
