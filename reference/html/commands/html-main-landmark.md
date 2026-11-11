# <main>

HTML command · Semantics

The content unique to this page. It must not sit inside header, footer, nav, aside or article, and there is one visible main per page.

## Syntax

```html
<main id="main" tabindex="-1"> ... </main>
```

## Example

```html
<a class="skip" href="#main">Skip to main content</a>

<main id="main" tabindex="-1">
  <h1>Bookings</h1>

  <section aria-labelledby="upcoming">
    <h2 id="upcoming">Upcoming stays</h2>
    <p>Check-in on 12 March.</p>
  </section>
</main>
```

## Details

tabindex="-1" makes main programmatically focusable, so the skip link can move focus into it. Without it some browsers scroll but leave focus on the link, and the next Tab press returns to the menu.

Several main elements are allowed only when all but one are hidden. That is a single page app pattern, not a normal page.
