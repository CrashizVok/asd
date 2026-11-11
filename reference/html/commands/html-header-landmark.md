# <header>

HTML command · Semantics

Introductory content for the page or for the nearest article. At top level it is the banner landmark; inside an article it is the article masthead.

## Syntax

```html
<header> ... </header>
```

## Example

```html
<!-- Top level: the page banner. -->
<header>
  <p>Riverside Hotel</p>
  <nav aria-label="Main">...</nav>
</header>

<!-- Inside an article: not a landmark, just the item header. -->
<article>
  <header>
    <h2>Quiet rooms, slow breakfast</h2>
    <p>Published <time datetime="2026-03-02">2 March 2026</time></p>
  </header>
  <p>The room faced the river.</p>
</article>
```

## Details

A header inside article, aside, main, nav or section is not the page banner. That scoping rule is why several header elements on one page are normal, and why a header around the top of a sidebar is not a landmark.

Do not use header for a block that merely sits at the top. If it does not introduce the content below it, use a div.
