# id

HTML command · Global attributes

Names one element for the whole document. CSS selectors, fragment links, label for attributes and getElementById all use it.

## Syntax

```html
<section id="search-results">
```

## Example

```html
<section id="search-results">
  <!-- one section, one name -->
  <h2>Search results</h2>
</section>

<a href="#search-results">Jump to results</a>

<!-- document.getElementById("search-results") finds this section -->
```

## Details

The value must be unique in the page and must not contain spaces. Two elements with the same id still render, but getElementById returns only the first, and a label for attribute points at the first one too.

CSS matches ids with a hash: #search-results. Keep ids stable, because JavaScript and test scripts depend on them.
