# aria-label and aria-labelledby

HTML command · Semantics

Gives a landmark or a section its accessible name. aria-labelledby points at visible text; aria-label supplies text that is not on screen.

## Syntax

```html
<nav aria-label="Main"> ... </nav>
<section aria-labelledby="section-title"> ... </section>
```

## Example

```html
<!-- Two navs need two different names. -->
<nav aria-label="Main">...</nav>
<nav aria-label="Pagination">...</nav>

<!-- Prefer the visible heading: the label cannot drift out of sync. -->
<section aria-labelledby="upcoming">
  <h2 id="upcoming">Upcoming stays</h2>
  <p>...</p>
</section>
```

## Details

aria-label is a string. aria-labelledby takes one or more ids and uses their text content. If visible text already names the block, aria-labelledby is usually the better choice.

Do not label every nav "Navigation". Repeated names tell the user nothing. Do not add aria-label to an element that already has a visible heading unless the heading is not descriptive.
