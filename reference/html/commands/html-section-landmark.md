# <section>

HTML command · Semantics

A thematic group of content, normally introduced by a heading. It becomes a region landmark only when it has an accessible name.

## Syntax

```html
<section aria-labelledby="id"> ... </section>
```

## Example

```html
<!-- The h2 names the region; aria-labelledby points at it. -->
<section aria-labelledby="upcoming">
  <h2 id="upcoming">Upcoming stays</h2>
  <p>One stay in March.</p>
</section>

<!-- A wrapper for layout only: div, not section. -->
<div class="grid">
  <p>...</p>
</div>
```

## Details

An unnamed section is generic, so it gives nothing that a div would not give. Use section when the block would appear in a table of contents, and div when the block exists for CSS.

Heading level follows structure: h2 for a section inside the page, h3 for a section inside a section.
