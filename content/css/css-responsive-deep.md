---
id: css-responsive-deep
lang: CSS
title: Responsive CSS
---

# Responsive CSS

## Simplest form

```css
/* Data shape: one column by default, three columns once the viewport is wide enough.
   Media queries only carry the differences between sizes. */
.cards {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;          /* the phone layout, written first */
}

@media (min-width: 48em) {             /* 48em is 768px at the default 16px root */
  .cards {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

Everything outside a media query is the small screen layout. A media query adds a change for a larger screen. The page must look right at 375px before any query runs.

## What it does

A responsive page adapts to the space the browser gives it. Three mechanisms do the work:

Fluid layout means the columns, gaps and type scale with the space, using `fr`, percentages, `minmax()` and `clamp()`. No query is involved.

Breakpoints mean the layout changes shape at a chosen width, because two columns stop being readable on a phone. A media query holds that change.

Content driven sizing means elements decide their own size from their content, with `auto-fit`, `min-content`, `max-content`, `ch` units and container queries. This is the part that keeps a card from needing a special rule at every width.

A fourth piece is not CSS at all: the viewport meta tag. Without it a phone renders the page at a fake 980px width and scales it down, which makes every media query fire as if the screen were a desktop. Check it before blaming a query.

## Every part

### The viewport meta tag

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

`width=device-width` sets the layout viewport to the real screen width. `initial-scale=1` starts at 100 percent zoom. Do not add `maximum-scale=1` or `user-scalable=no`. They block pinch zoom and fail an accessibility review. The one legitimate exception is a game canvas, and it still needs a scale control.

On a 375px phone, `width=device-width` makes `100vw` equal 375px and a `min-width: 768px` query not match. That is the whole point.

### Media queries

```css
@media (min-width: 48em) { /* ... */ }
@media (max-width: 47.99em) { /* ... */ }
@media (min-width: 48em) and (max-width: 64em) { /* ... */ }
@media (width >= 48em) { /* range syntax, same as min-width */ }
@media (hover: none) and (pointer: coarse) { /* touch devices */ }
@media (prefers-reduced-motion: reduce) { /* ... */ }
@media print { /* ... */ }
```

`min-width` matches when the viewport is at least that wide. `max-width` matches when it is at most that wide. Chaining with `and` narrows both limits. `,` means or. `not` inverts. `only` is a legacy guard for very old browsers.

Range syntax, `(width >= 48em)`, reads better when a query has two limits: `(48em <= width < 64em)`. Support is fine in current browsers, but plain `min-width` is the safer answer on an exam that names no version.

Use `em` for breakpoints rather than `px` where you can. `1em` in a media query is the initial font size, normally 16px, not the parent's font size, so `48em` is 768px. Because it is relative, it follows the user's browser font size setting and page zoom, which is what a person using large text expects. Pixel breakpoints stay fixed while the text grows, and the layout breaks earlier.

Choose breakpoints from content, not from device names. Widen the window until the line of text passes about 75 characters or a card gets too cramped, then put the query there. Device names age badly: phones are 360, 375, 390, 393 and 430 CSS pixels wide, and foldables change mid session.

### Mobile first

Mobile first means the base styles describe the narrow layout and media queries add complexity as space appears, using `min-width`. Desktop first means the base styles describe the wide layout and queries remove complexity with `max-width`.

Mobile first is easier to keep correct. Each query adds one capability, the cascade reads in the direction the screen grows, and a browser that does not understand a query still has a working page. With `max-width` the base page is the most complex one, and every removal must undo a rule that is already applied.

### Fluid type with clamp

```css
h1 {
  font-size: clamp(1.75rem, 1.2rem + 2.2vw, 2.75rem);
}
```

`clamp(minimum, preferred, maximum)` returns the preferred value, held between the two limits. At 375px the preferred part is small and the minimum wins; at 1440px the maximum wins. The middle value mixes a fixed part with a viewport part, `1.2rem + 2.2vw`, so the growth is gentle and still responds to the user's font size setting. A pure `2.5vw` ignores that setting, which is why the fixed part belongs there.

`min()` and `max()` are the two halves used alone. `width: min(1100px, 100% - 32px)` caps a container and keeps a gutter at the same time. `padding-inline: max(16px, env(safe-area-inset-left))` respects a notch.

### Viewport units

`vw` and `vh` are one percent of the viewport width and height. `1vw` on a 375px screen is 3.75px. `100vw` includes the scrollbar width on desktop, so a full width element with `100vw` can produce a horizontal scrollbar. `100%` avoids that.

Mobile browser toolbars retract while scrolling, so `vh` changes meaning. The newer units fix this: `svh` is the small viewport with the toolbar visible, `lvh` is the large viewport with it hidden, `dvh` is the current dynamic one. Use `100dvh` for a full screen panel, `100svh` when content must never be cut off behind the toolbar.

Keep `vw` out of body text. `font-size: 3vw` gives 11px on a 375px phone, which fails any readability check. Clamp it or leave it in `rem`.

### Container width and gutters

```css
.wrap {
  width: min(1100px, 100% - 2 * 16px);
  margin-inline: auto;
}
```

This one rule replaces a max width, a width of 100 percent and a horizontal padding. The outer gutter stays 16px on a phone and the content stops growing at 1100px. `margin-inline: auto` centers it.

### Responsive cards

```css
.cards {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
}
```

`auto-fit` creates as many columns as fit. `minmax(260px, 1fr)` says each column is at least 260px and shares the leftover space. `min(100%, 260px)` protects the case where the container is narrower than 260px, where a bare `260px` would overflow. No media query is needed at all, which is why this is the default card grid in most codebases.

`auto-fill` keeps empty tracks, `auto-fit` collapses them. For a card grid, `auto-fit` is almost always what you want.

### Responsive navigation

Three patterns cover most needs, in increasing order of complexity.

Wrapping links is the cheapest. `display: flex; flex-wrap: wrap; gap: 8px` lets the nav become two rows on a phone with no JavaScript and no hidden content.

A disclosure widget uses `<details>` and `<summary>`, which is keyboard accessible and needs no script. The summary is the button, the links are inside.

```html
<details class="nav">
  <summary>Menu</summary>
  <ul>
    <li><a href="#rooms">Rooms</a></li>
    <li><a href="#bookings">Bookings</a></li>
  </ul>
</details>
```

A toggle button with `aria-expanded` and a class is the pattern for a full mobile menu with animation. It needs JavaScript and it needs the `aria-expanded` state kept in sync, plus focus handling.

Do not hide the nav with `display: none` and leave no way to open it. Content that exists only on wide screens is a common accessibility failure.

### The fixed navbar and the space it eats

A fixed header leaves the flow, so the content underneath starts at the top of the page and the first heading hides behind the header. Two things fix it:

```css
body {
  padding-top: var(--header-h);
}

html {
  scroll-padding-top: calc(var(--header-h) + 12px);
}
```

The padding moves the content down once. `scroll-padding-top` fixes anchor links: without it, clicking `#bookings` scrolls the heading to the top of the viewport, exactly under the fixed header. `scroll-margin-top` on the target sections does the same job, section by section, and is better when only some elements are linked.

The header height should live in one custom property. If the header becomes taller on a phone, change the property inside one media query and both the padding and the scroll offset follow.

### Testing at 375px

375 by 667 is the size of a small phone in current use, and it is the usual design target. Test there for:

- No horizontal scroll. A single element wider than the viewport creates it, often a long word, a table, a `100vw` block or a fixed width image.
- Text at least 16px, so iOS does not zoom the page when an input gets focus.
- Tap targets at least 44 by 44 CSS pixels, with 8px between them.
- No content clipped by a fixed header, a fixed footer or a notch.
- Line length between 45 and 75 characters. At 375px with 16px padding you have about 343px, which suits 16px text.
- The page still works at 200 percent zoom, where the effective viewport is about 187px.

## Examples

### Example 1: fluid heading and a capped container

```html
<main class="page">
  <h1>Rooms and rates</h1>
  <p class="lede">Six rooms, breakfast included, free cancellation until 48 hours before arrival.</p>
</main>
```

```css
:root {
  --gutter: 16px;
  --measure: 68ch;          /* about 68 characters per line, a comfortable read */
}

.page {
  /* Cap the width, keep a gutter on small screens, center it. */
  width: min(1100px, 100% - 2 * var(--gutter));
  margin-inline: auto;
  padding-block: 32px;
}

.page h1 {
  /* Grows with the viewport but never below 28px or above 44px.
     The rem part keeps the user's font size setting in play. */
  font-size: clamp(1.75rem, 1.25rem + 2.2vw, 2.75rem);
  line-height: 1.15;
  margin: 0 0 12px;
}

.lede {
  /* Text lines stay readable even when the container is 1100px wide. */
  max-width: var(--measure);
  font-size: clamp(1rem, 0.95rem + 0.3vw, 1.15rem);
  color: #445;
}
```

At 375px the heading computes to 28px because the preferred value is under the minimum. At 1440px it stops at 44px. Nothing in this example depends on a media query.

### Example 2: cards that reflow without a breakpoint

```html
<ul class="cards">
  <li class="card">
    <h2>Single</h2>
    <p>One bed, 14 square metres.</p>
    <p class="card__price">68 EUR</p>
  </li>
  <li class="card">
    <h2>Double</h2>
    <p>Two beds, 22 square metres.</p>
    <p class="card__price">94 EUR</p>
  </li>
  <li class="card">
    <h2>Family</h2>
    <p>Four beds, 34 square metres.</p>
    <p class="card__price">142 EUR</p>
  </li>
</ul>
```

```css
.cards {
  display: grid;
  gap: 16px;
  padding: 0;
  margin: 0;
  list-style: none;
  /* As many columns as fit, each at least 240px, but never wider than the
     container. min(100%, 240px) prevents overflow below 240px. */
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
}

.card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border: 1px solid #d8dde6;
  border-radius: 12px;
  background: #fff;
}

.card h2 {
  margin: 0;
  font-size: 1.1rem;
}

.card p {
  margin: 0;
}

.card__price {
  /* Pushed to the bottom so prices line up across cards of different heights. */
  margin-top: auto;
  font-weight: 600;
}
```

One column at 375px, two around 520px, three or four on a desktop, with no query. If the design needs a different gap on wide screens, add a single `@media (min-width: 64em)` rule for the gap only.

### Example 3: a full mobile first page with a fixed header

This page is written small screen first. Read the media query blocks in order: the base layout, then the tablet additions, then the desktop additions.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <!-- Required, or a phone pretends to be 980px wide. -->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hotel rooms</title>
  <style>
    :root {
      --header-h: 56px;          /* one value drives padding and anchor offset */
      --gutter: 16px;
      --z-header: 10;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    html {
      /* Anchor links stop below the fixed header instead of under it. */
      scroll-padding-top: calc(var(--header-h) + 12px);
      scroll-behavior: smooth;
    }

    @media (prefers-reduced-motion: reduce) {
      html {
        scroll-behavior: auto;
      }
    }

    body {
      margin: 0;
      font: 16px/1.6 system-ui, sans-serif;
      color: #1c2330;
      background: #f6f8fb;
      /* The header is out of flow: reserve its height once. */
      padding-top: var(--header-h);
    }

    .header {
      position: fixed;
      inset: 0 0 auto 0;
      height: var(--header-h);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 0 var(--gutter);
      background: #123f6d;
      color: #fff;
      z-index: var(--z-header);
    }

    .header a {
      color: #fff;
      text-decoration: none;
    }

    /* Mobile nav: a native disclosure, no script, keyboard accessible. */
    .nav summary {
      padding: 8px 12px;
      border: 1px solid rgb(255 255 255 / 45%);
      border-radius: 8px;
      cursor: pointer;
      list-style: none;
    }

    .nav summary::-webkit-details-marker {
      display: none;
    }

    .nav ul {
      position: absolute;        /* overlays the page instead of pushing it */
      top: var(--header-h);
      right: var(--gutter);
      margin: 0;
      padding: 8px;
      min-width: 180px;
      list-style: none;
      background: #fff;
      border: 1px solid #d8dde6;
      border-radius: 10px;
      box-shadow: 0 12px 28px rgb(12 18 28 / 18%);
    }

    .nav li a {
      display: block;
      padding: 10px 12px;        /* 44px tall tap target */
      color: #1c2330;
    }

    .page {
      width: min(1100px, 100% - 2 * var(--gutter));
      margin-inline: auto;
      padding-block: 24px 48px;
    }

    .page h1 {
      font-size: clamp(1.6rem, 1.2rem + 2vw, 2.4rem);
      line-height: 1.2;
      margin: 0 0 8px;
    }

    .lede {
      max-width: 68ch;
      margin: 0 0 24px;
      color: #445;
    }

    .cards {
      display: grid;
      gap: 16px;
      grid-template-columns: 1fr;   /* phone: one card per row */
      padding: 0;
      margin: 0 0 32px;
      list-style: none;
    }

    .card {
      padding: 16px;
      background: #fff;
      border: 1px solid #d8dde6;
      border-radius: 12px;
    }

    .card h2 {
      margin: 0 0 6px;
      font-size: 1.1rem;
    }

    .card p {
      margin: 0;
    }

    .hero {
      /* Height follows the visible area on a phone, not the taller one behind
         the browser toolbar. svh would be the safe minimum. */
      min-height: 40svh;
      display: grid;
      place-items: center;
      padding: 24px 16px;
      margin-bottom: 24px;
      border-radius: 14px;
      background: linear-gradient(160deg, #123f6d, #2a6ea8);
      color: #fff;
      text-align: center;
    }

    .hero p {
      margin: 0;
      max-width: 40ch;
    }

    /* Tablet and up: two cards per row, inline nav, roomier header. */
    @media (min-width: 40em) {
      :root {
        --header-h: 64px;
        --gutter: 24px;
      }

      .cards {
        grid-template-columns: repeat(2, 1fr);
      }

      .nav summary {
        display: none;             /* the disclosure is no longer needed */
      }

      .nav ul {
        position: static;
        display: flex;
        gap: 4px;
        min-width: 0;
        padding: 0;
        background: none;
        border: 0;
        box-shadow: none;
      }

      .nav li a {
        color: #fff;
      }
    }

    /* Desktop: three cards, a wider hero, a two column content area. */
    @media (min-width: 64em) {
      .cards {
        grid-template-columns: repeat(3, 1fr);
      }

      .hero {
        min-height: 340px;
      }

      .page {
        padding-block: 32px 64px;
      }
    }

    /* Print: drop the chrome, keep the content readable. */
    @media print {
      .header {
        display: none;
      }

      body {
        padding-top: 0;
        background: #fff;
      }
    }
  </style>
</head>
<body>
  <header class="header">
    <strong>Hotel rooms</strong>
    <details class="nav">
      <summary>Menu</summary>
      <ul>
        <li><a href="#rooms">Rooms</a></li>
        <li><a href="#rates">Rates</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </details>
  </header>

  <main class="page">
    <h1>Six rooms, one yard</h1>
    <p class="lede">Breakfast included. Free cancellation until 48 hours before arrival.</p>

    <div class="hero">
      <p>Quiet rooms above a courtyard, five minutes from the station.</p>
    </div>

    <section id="rooms">
      <h2>Rooms</h2>
      <ul class="cards">
        <li class="card">
          <h2>Single</h2>
          <p>One bed, 14 square metres.</p>
          <p>68 EUR per night.</p>
        </li>
        <li class="card">
          <h2>Double</h2>
          <p>Two beds, 22 square metres.</p>
          <p>94 EUR per night.</p>
        </li>
        <li class="card">
          <h2>Family</h2>
          <p>Four beds, 34 square metres.</p>
          <p>142 EUR per night.</p>
        </li>
      </ul>
    </section>

    <section id="rates">
      <h2>Rates</h2>
      <p>Prices include breakfast and tax. Children under six stay free.</p>
    </section>

    <section id="contact">
      <h2>Contact</h2>
      <p>Reception is open from 7:00 to 22:00.</p>
    </section>
  </main>
</body>
</html>
```

Follow one value through the file: `--header-h` is 56px on a phone and 64px from 40em up. The body padding, the fixed header height and `scroll-padding-top` all read that one property, so the anchor links stay correct when the header grows. That is the reason the value lives in `:root` and not in three separate rules.

## Common mistakes

- Omitting the viewport meta tag, then debugging queries that fire as if the phone were 980px wide.
- Mixing mobile first and desktop first in one file, so half the queries use `min-width` and half use `max-width` and the states conflict.
- Setting a fixed `width: 1200px` on a container. It cannot shrink and every phone gets horizontal scroll.
- Forgetting that `100vw` includes the scrollbar on desktop, which adds a horizontal scrollbar on an otherwise correct page.
- Using `height: 100vh` for a full screen section on a phone, where the toolbar cuts off the bottom.
- Writing `font-size: 3vw` for body text, which lands near 11px on a 375px screen.
- Choosing breakpoints from device names and then needing a new query for every new phone.
- Hiding navigation with `display: none` on mobile and providing no visible way to open it.
- A hamburger button that only responds to click, with no keyboard focus and no `aria-expanded`.
- Leaving out `scroll-padding-top` and finding every anchor link lands under the fixed header.
- Setting a fixed header height in `px` in three places and changing one of them.
- `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))` in a 260px container, which overflows because the minimum is larger than the space.
- Testing only at 1440px and 375px and missing the awkward middle where a two column layout has 200px columns.
- Using `em` for font sizes on the body and then shrinking and growing them five levels deep, so the scale becomes unpredictable.
- Blocking zoom with `maximum-scale=1` because a form input zooms on focus on iOS. The fix is a 16px input font size.

## Exam checklist

- Can you write the viewport meta tag from memory and say what breaks without it?
- Can you explain the difference between `min-width` and `max-width` queries and which one belongs to mobile first?
- Do you know what `1em` means inside a media query, and why it is not the parent's font size?
- Can you write `clamp()` with a fixed part and a viewport part in the preferred value, and say why the fixed part matters?
- Can you name the difference between `vh`, `svh`, `lvh` and `dvh` and pick one for a full height panel?
- Can you build a card grid that needs no media query?
- Can you make a nav that works at 375px without JavaScript, and say why `<details>` is a good choice?
- Can you explain the pair of rules that stop a fixed header from covering content and anchor targets?
- Can you list three things to check at 375px, and one at 200 percent zoom?
- Can you say why `auto-fit` and `auto-fill` differ, and which suits cards?
