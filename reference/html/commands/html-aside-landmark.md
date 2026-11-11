# <aside>

HTML command · Semantics

Content related to the main flow but not part of it: a sidebar, a note, related links. It becomes the complementary landmark at top level.

## Syntax

```html
<aside aria-labelledby="id"> ... </aside>
```

## Example

```html
<main id="main">
  <h1>Bookings</h1>
  <p>The booking details.</p>
</main>

<!-- Optional content, outside main. A screen reader can skip it in one move. -->
<aside aria-labelledby="help">
  <h2 id="help">Need help?</h2>
  <p>Reception is open from 7:00 to 22:00.</p>
  <p><a href="tel:+3612345678">Call +36 1 234 5678</a></p>
</aside>
```

## Details

An aside nested inside an article is a note about that article and does not appear as a top level complementary landmark. That is expected.

Never put the price, the booking form or anything the user must act on inside an aside. If it is required, it belongs in main.
