# form action and method

HTML command · Form

action is the URL that receives the submitted data. method decides whether the pairs travel in the query string or in the request body.

## Syntax

```html
<form action="/book" method="post"> ... </form>
```

## Example

```html
<!-- GET: pairs land in the URL, good for search -->
<form action="/search" method="get">
  <label for="q">Search</label>
  <input id="q" name="q" type="search">
  <button type="submit">Search</button>
</form>

<!-- POST: pairs land in the body, used for changes and private data -->
<form action="/book" method="post">
  <label for="customer_email">Email</label>
  <input id="customer_email" name="customer_email" type="email" required>
  <button type="submit">Book</button>
</form>
```

## Details

The default method is `get`, and an omitted or empty `action` posts back to the current document URL. With GET, the form data replaces any query string already present on the action URL. With POST, the action URL keeps its query string and the pairs go into the body. Never use GET for passwords, for large text, or for a request that changes state, because query strings end up in history, logs, and referrer headers.
