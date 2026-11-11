# <search>

HTML command · Semantic text

Wraps a search form or filter set. It gives the region a search landmark without adding a role by hand.

## Syntax

```html
<search> ... </search>
```

## Example

```html
<!-- a search landmark without adding a role -->
<search>
  <form action="/search" method="get">
    <label for="city">City</label>
    <input id="city" name="city" type="search">
    <button>Search</button>
  </form>
</search>
```
