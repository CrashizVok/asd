---
id: html-semantics-deep
lang: HTML
title: Semantic HTML
---

# Semantic HTML

A semantic element names the job its content does. The browser turns that name into an accessibility role, a landmark, default keyboard behaviour, and a hook for CSS. Two pages can look identical on screen and behave very differently in a screen reader, because one is a pile of `div` elements and the other is `header`, `nav`, `main`, `article` and `footer`.

The exam question is usually "which tag belongs here", so the useful skill is deciding what a block of content *is*, not what it should look like. Styling comes later and never changes the tag.

## Simplest form

```html
<!-- Data shape: one document tree, one h1, one main, landmarks named by their element -->
<body>
  <header>Site name and logo</header>
  <nav aria-label="Main">Links to the main pages</nav>
  <main id="main">
    <h1>Bookings</h1>
    <p>The page content.</p>
  </main>
  <footer>Contact and copyright</footer>
</body>
```

Four elements and one heading are enough to give a screen reader user a banner, a navigation landmark, a main region and a content info region, plus a heading list with one entry.

## What the browser does with an element

Every element becomes a node in two trees at once. The DOM tree is what CSS and JavaScript see. The accessibility tree is what a screen reader, a switch device, or a voice control tool sees. The element name decides the second tree:

- `header` becomes the `banner` landmark, unless it sits inside `article`, `aside`, `main`, `nav` or `section`.
- `nav` becomes `navigation`.
- `main` becomes `main`.
- `aside` becomes `complementary`, unless it sits inside `article`, `aside`, `nav` or `section`.
- `footer` becomes `contentinfo`, with the same nesting exception as `header`.
- `section` becomes `region` only when it has an accessible name. Without one it is a generic container.
- `form` becomes `form` when it has an accessible name.
- `figure` becomes `figure`, `figcaption` becomes its caption.
- `details` and `summary` become a disclosure group with an expanded or collapsed state.

The exceptions matter for exams. A `header` inside an `article` is not the page banner, it is the article's own masthead, and it is not announced as a landmark at all. A `footer` inside a `section` is not the page footer. One page can contain many `header` and `footer` elements, and often should.

Default browser behaviour comes with the tag as well. `details` opens and closes on click and on Enter or Space without a line of JavaScript. `nav` does not, but a list of links inside it is announced as navigation. `button` is focusable and submits forms. A `div` with a click handler is none of those things until you rebuild the behaviour by hand.

## Landmarks, one by one

### header

`header` holds introductory content for its nearest sectioning ancestor: the site name, the logo, the search box, the top navigation. There is no rule that a page may have only one. Put it at the top of the page and it is the banner. Put it inside an `article` and it holds the article title and metadata, which is a common pattern for blog posts and product cards.

Do not use `header` for a block that happens to be at the top of a column. If it does not introduce the content that follows, it is a `div` with a class.

### nav

`nav` marks a group of links that forms a major navigation block. The main menu qualifies, so does a table of contents, a breadcrumb trail, and a pagination control. A single link in a paragraph does not, and neither does a footer list of social links that nobody navigates with.

A page usually has more than one `nav`, so each needs a name. The name is what a screen reader announces in the landmark list:

```html
<nav aria-label="Main">...</nav>
<nav aria-label="Breadcrumb">...</nav>
<nav aria-label="Pagination">...</nav>
```

Without labels a screen reader lists three identical "navigation" entries and the user has to visit each one to find out which is which. The newer `search` element wraps a search form and gives it a search landmark, so a search box does not need to be forced into `nav`.

### main

`main` holds the content that is unique to this page. It must not sit inside `header`, `footer`, `nav`, `aside` or `article`, because those are either shared across pages or subordinate to something else.

One visible `main` per page. The specification allows several as long as all but one are `hidden`, which is a pattern for single page apps that swap views, not for ordinary pages. The element is the target of the skip link:

```html
<a class="skip" href="#main">Skip to content</a>
<main id="main" tabindex="-1">...</main>
```

`tabindex="-1"` makes the element programmatically focusable, so the browser moves focus into `main` after the skip link is used. Without it some browsers scroll but leave focus on the link, and the next Tab press returns to the menu the user wanted to skip.

### section

`section` groups content around one theme, normally with a heading. It is not a styling wrapper. A `section` without an accessible name is generic, which means it gives no benefit over a `div`, and a page full of unnamed sections is a page full of noise in the markup with no gain in the accessibility tree.

The name comes from a heading that the section contains or from `aria-label` or `aria-labelledby`. The heading is better, because sighted users get the same label:

```html
<section aria-labelledby="upcoming">
  <h2 id="upcoming">Upcoming stays</h2>
  <p>...</p>
</section>
```

Use `section` when the block would appear in a table of contents. Use `div` when the block exists only to hold a grid or a background.

### article

`article` is a self-contained composition that would still make sense on its own: a blog post, a news story, a product review, a forum post, a comment, a widget. The test is whether the content could be syndicated into another page or feed without losing its meaning. If yes, it is an `article`.

Give it a heading. Most articles also have their own `header` for the title and date, their own `footer` for tags or the author, and possibly an `aside` for a pull quote. Articles can nest: a blog post is an `article`, and each comment under it is also an `article`. A product card in a grid is often not an `article`, because the card alone does not carry the full product meaning. A list item or a `div` is honest there.

### aside

`aside` is content related to what surrounds it but not part of the main flow: a sidebar, a note, a glossary box, related links, an advertisement, a pull quote inside an article. Screen reader users can jump straight past it.

An `aside` nested inside an `article` is usually a note about that article and does not appear as a top level complementary landmark. That is correct behaviour, not a bug. Do not use `aside` for content the user needs to complete the task. If it contains the price or the submit button, it belongs in `main`.

### footer

`footer` holds closing information for its nearest sectioning ancestor: copyright, contact details, a sitemap, related links, the author of an article. Like `header`, it is a `contentinfo` landmark only when it is not nested in `article`, `aside`, `main`, `nav` or `section`.

Contact details belong in an `address` element inside the footer, not in a `p`. The `address` element is for contact information of the nearest `article` or `body`, which is exactly what a site footer holds. It is not a generic address block for any postal address on the page.

### figure and figcaption

`figure` wraps content that the main text refers to and that could be moved away without breaking the flow: an image, a code listing, a chart, a table, a quotation. `figcaption` is its caption and must be the first or the last child. It cannot sit in the middle.

```html
<figure>
  <img src="room.jpg" alt="Double room with a balcony facing the river"
       width="640" height="360">
  <figcaption>The double room, photographed from the door.</figcaption>
</figure>
```

The `alt` text and the caption do different jobs. `alt` describes the image for someone who cannot see it. The caption is visible text for everyone and explains why the image is there. Do not repeat the same sentence in both. A decorative image has `alt=""` and needs no figure. `figure` is not required for every image: use it when the text points at the image ("see figure 2") or when the caption adds information.

### details and summary

`details` is a native disclosure widget. Its first child must be `summary`, which is the always visible label and the click target. Everything after the summary is shown when the element has the `open` attribute and hidden otherwise.

```html
<details>
  <summary>Can I change the dates?</summary>
  <p>Yes, up to 48 hours before check-in, from the booking page.</p>
</details>
```

Closed content is removed from the accessibility tree, so a search engine and a screen reader only see it after the user opens the element. Do not store essential text there. The browser handles keyboard operation: Tab reaches the summary, Enter and Space toggle it, and the state is announced as expanded or collapsed. The disclosure triangle is a `::marker` on the summary and can be styled or replaced with CSS.

Useful attributes and behaviour:

- `open` starts the element expanded. It is a boolean attribute, so `open` alone is enough.
- The `name` attribute groups several `details` elements so that opening one closes the others, which is the modern way to build an accordion.
- `id` on the element allows a link with a fragment to open it in browsers that support it.
- No JavaScript is needed, and nothing breaks when scripts fail.

Do not build navigation menus out of `details`. A menu is navigation, and the element announces itself as a disclosure, not as a menu. Use it for FAQ entries, optional settings, and long legal text.

### div and span

`div` and `span` carry no meaning, and that is their purpose. Use `div` for a layout wrapper, a grid container, a modal overlay that already has its own role, or a hook for CSS. Use `span` for a run of text inside a paragraph that needs styling.

The rule is not "avoid div". The rule is "do not use div where a more specific element exists". A clickable `div` that acts as a button is the classic failure: it is not focusable, it does not respond to Enter or Space, and it is announced as plain text. Use `button`.

## Naming landmarks and headings

Landmark names and heading text are the navigation system of a page. The rules that carry marks:

- One `h1` per page, matching the page topic. Do not use `h1` for the site name in the header and again for the article.
- Headings run in order: `h1`, then `h2` for the main blocks, then `h3` inside them. Do not skip levels to get a smaller font. Pick the level by structure and size it with CSS.
- Do not choose a heading level for its default size. `h4` at the top of a card is a structure error even if it looks right.
- A heading inside a `section` gives the section its name. That is why the `h2` and the section are paired.
- If two landmarks of the same type exist, label each one with `aria-label` or `aria-labelledby`. Prefer `aria-labelledby` pointing at the visible heading, so the label cannot drift out of sync.
- A label of "Navigation" on every `nav` is worse than no label, because it tells the user nothing.
- A visually hidden heading is allowed when the design has no visible title but the structure needs one.

`aria-labelledby` takes one or more ids and uses their text content as the name:

```html
<aside aria-labelledby="help-title">
  <h2 id="help-title">Need help?</h2>
</aside>
```

The accessible name becomes "Need help?" and the visible text stays in sync automatically.

Do not add ARIA roles that duplicate the element. `nav role="navigation"` is redundant, and redundant roles are a common exam distractor. The first rule of ARIA is to use the native element.

## Examples

### Example 1: the smallest complete page

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Bookings</title>
</head>
<body>
  <!-- First tab stop, invisible until focused. -->
  <a class="skip" href="#main">Skip to main content</a>

  <header>
    <p>Riverside Hotel</p>
  </header>

  <!-- One nav needs no label, but a label costs nothing and helps tests. -->
  <nav aria-label="Main">
    <ul>
      <li><a href="/rooms">Rooms</a></li>
      <li><a href="/bookings" aria-current="page">Bookings</a></li>
    </ul>
  </nav>

  <!-- tabindex="-1" lets the skip link move focus here, not just scroll. -->
  <main id="main" tabindex="-1">
    <h1>Your bookings</h1>
    <p>You have one upcoming stay.</p>
  </main>

  <footer>
    <p><small>Prices include VAT.</small></p>
  </footer>
</body>
</html>
```

### Example 2: several landmarks with distinct names

```html
<body>
  <header>
    <a href="/">Riverside Hotel</a>
    <nav aria-label="Main">
      <ul>
        <li><a href="/rooms">Rooms</a></li>
        <li><a href="/bookings">Bookings</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <!-- A breadcrumb is navigation too, and its name separates it from the menu. -->
  <nav aria-label="Breadcrumb">
    <ol>
      <li><a href="/">Home</a></li>
      <li><a href="/bookings" aria-current="page">Bookings</a></li>
    </ol>
  </nav>

  <main id="main" tabindex="-1">
    <h1>Bookings</h1>

    <!-- The heading names the region, so no extra aria-label is needed. -->
    <section aria-labelledby="upcoming">
      <h2 id="upcoming">Upcoming stays</h2>
      <p>One stay in March.</p>
    </section>

    <section aria-labelledby="past">
      <h2 id="past">Past stays</h2>
      <p>No past stays yet.</p>
    </section>
  </main>

  <!-- Outside main, so it becomes a complementary landmark. -->
  <aside aria-labelledby="help">
    <h2 id="help">Need help?</h2>
    <p>Reception is open from 7:00 to 22:00.</p>
  </aside>

  <footer>
    <address>
      Riverside Hotel<br>
      12 Dock Street<br>
      <a href="tel:+3612345678">+36 1 234 5678</a>
    </address>
  </footer>
</body>
```

A screen reader announces this page as: banner, navigation (Main), navigation (Breadcrumb), main, complementary (Need help?), content information. Five landmarks a user can jump between with one shortcut.

### Example 3: article, comments, figure and details

```html
<main id="main" tabindex="-1">
  <h1>Riverside Hotel</h1>

  <!-- The review is self-contained: it could be syndicated on its own. -->
  <article>
    <header>
      <h2>Quiet rooms, slow breakfast</h2>
      <p>
        Published on <time datetime="2026-03-02">2 March 2026</time>
        by <span class="author">Guest 4182</span>
      </p>
    </header>

    <p>The room faced the river and the street noise stopped after ten.</p>

    <!-- The text refers to the photo, so it is a figure, not a bare img. -->
    <figure>
      <img src="river-view.jpg"
           alt="A river seen from a hotel window, with a bridge on the left"
           width="800" height="450">
      <figcaption>The view from room 304.</figcaption>
    </figure>

    <!-- A nested article: each comment stands on its own. -->
    <section aria-labelledby="comments">
      <h3 id="comments">Comments</h3>

      <article>
        <header>
          <h4>Reply from the hotel</h4>
          <p><time datetime="2026-03-03">3 March 2026</time></p>
        </header>
        <p>Thank you. Breakfast now starts at 6:30 on weekdays.</p>
      </article>
    </section>

    <footer>
      <p>Tags: <a href="/tags/river">river</a>, <a href="/tags/quiet">quiet</a></p>
    </footer>
  </article>

  <section aria-labelledby="faq">
    <h2 id="faq">Questions</h2>

    <!-- Native disclosure: no script, keyboard support included. -->
    <details>
      <summary>Is breakfast included?</summary>
      <p>Yes, from 6:30 to 10:00 in the ground floor room.</p>
    </details>

    <details open>
      <summary>Can I pay at the hotel?</summary>
      <p>Yes, by card or cash at reception. The card is not charged in advance.</p>
    </details>
  </section>
</main>
```

Note the heading levels: `h1` page, `h2` article and FAQ, `h3` comments, `h4` a comment title. Nothing skipped, no level chosen for size.

### Example 4: a full page, read from top to bottom

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Riverside Hotel: your bookings</title>

  <style>
    /* The skip link is off screen until it receives keyboard focus. */
    .skip {
      position: absolute;
      left: -9999px;
    }
    .skip:focus {
      left: 1rem;
      top: 1rem;
      padding: 0.5rem 0.75rem;
      background: #fff;
      outline: 2px solid #1a4f8b;
    }

    /* A visible focus ring is part of accessibility, not decoration. */
    a:focus-visible,
    summary:focus-visible {
      outline: 2px solid #1a4f8b;
      outline-offset: 2px;
    }

    /* One column on phones, content plus sidebar from 60rem up. */
    .layout {
      display: grid;
      gap: 1.5rem;
    }
    @media (min-width: 60rem) {
      .layout {
        grid-template-columns: minmax(0, 1fr) 18rem;
      }
    }
  </style>
</head>
<body>
  <!-- Skip link: first tab stop, jumps over the repeated menu. -->
  <a class="skip" href="#main">Skip to main content</a>

  <!-- Top level header: the banner landmark. -->
  <header>
    <p><strong>Riverside Hotel</strong></p>

    <!-- Main menu, named because a breadcrumb nav follows later. -->
    <nav aria-label="Main">
      <ul>
        <li><a href="/rooms">Rooms</a></li>
        <li><a href="/bookings" aria-current="page">Bookings</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <!-- Second navigation block, so it gets its own name. -->
  <nav aria-label="Breadcrumb">
    <ol>
      <li><a href="/">Home</a></li>
      <li><a href="/bookings" aria-current="page">Bookings</a></li>
    </ol>
  </nav>

  <div class="layout">
    <!-- tabindex="-1" gives the skip link somewhere to put focus. -->
    <main id="main" tabindex="-1">
      <h1>Your bookings</h1>

      <!-- Named by its heading: a region landmark. -->
      <section aria-labelledby="upcoming">
        <h2 id="upcoming">Upcoming stays</h2>

        <!-- One booking is a self-contained item with its own header and footer. -->
        <article>
          <header>
            <h3>Double room, 12 to 14 March</h3>
            <p>
              Booked on <time datetime="2026-02-01">1 February 2026</time>
              for 2 guests.
            </p>
          </header>

          <p>
            Check-in from 14:00. The room has a balcony facing the river.
          </p>

          <!-- Referenced from the paragraph above, so a figure is correct. -->
          <figure>
            <img src="room-304.jpg"
                 alt="Double bed, desk and open balcony door in a bright room"
                 width="640" height="360" loading="lazy">
            <figcaption>Room 304, the room on this booking.</figcaption>
          </figure>

          <footer>
            <p>
              Free cancellation until
              <time datetime="2026-03-10">10 March 2026</time>.
            </p>
          </footer>
        </article>
      </section>

      <section aria-labelledby="past">
        <h2 id="past">Past stays</h2>
        <p>No past stays yet.</p>
      </section>

      <!-- FAQ entries: native disclosure, no JavaScript. -->
      <section aria-labelledby="questions">
        <h2 id="questions">Questions</h2>

        <details>
          <summary>Can I change the dates?</summary>
          <p>Yes, up to 48 hours before check-in, from this page.</p>
        </details>

        <details>
          <summary>Is breakfast included?</summary>
          <p>Yes, from 6:30 to 10:00.</p>
        </details>
      </section>
    </main>

    <!-- Complementary content, outside main. It can be skipped in one move. -->
    <aside aria-labelledby="help">
      <h2 id="help">Need help?</h2>
      <p>Reception is open from 7:00 to 22:00.</p>
      <p><a href="tel:+3612345678">Call +36 1 234 5678</a></p>
    </aside>
  </div>

  <!-- Top level footer: contentinfo. Contact data belongs in address. -->
  <footer>
    <address>
      Riverside Hotel<br>
      12 Dock Street<br>
      <a href="mailto:front@example.test">front@example.test</a>
    </address>
    <p><small>Prices include VAT. This sample uses fictional data.</small></p>
  </footer>
</body>
</html>
```

The page has one `h1`, one `main`, five top level landmarks, two named `nav` elements, one `article`, one `aside`, one `figure`, and two `details`. Every landmark can be reached from the screen reader landmark list, and every heading appears in the heading list in document order.

## Common mistakes

- Using `div` for a button, a link, or a heading. None of them get keyboard behaviour, a role, or a place in the heading list.
- Putting `main` inside a `header`, `nav`, or `aside`, which breaks the skip link target and the landmark order.
- Adding `role="navigation"` to `nav` or `role="banner"` to `header`. The element already has the role, and the extra attribute hides mistakes instead of fixing them.
- Creating a `section` with no heading and no label, then expecting a landmark. It is generic until it has a name.
- Using `section` as a styling wrapper. Use `div`.
- Two `nav` elements with no `aria-label`, which produce two identical entries in the landmark list.
- Choosing `h3` because it looks smaller, or using `h2` for the site name above the `h1`. Heading level is structure.
- Writing the same sentence in `alt` and in `figcaption`, so a screen reader user hears it twice.
- Putting essential content inside a closed `details`, where the accessibility tree hides it.
- Using `header` for the top of every card. It is not a banner there, and if the card is not an article, `div` is clearer.
- Using `aside` for the price, the booking form, or anything the user must act on.
- A skip link whose target has no `id` or no `tabindex="-1"`, so focus never moves.
- Forgetting `lang` on `html`, which leaves screen readers guessing the pronunciation.
- Using `address` for any postal address on the page instead of the contact details of the page or article.

## Exam checklist

1. Every page has `<!DOCTYPE html>`, `html` with `lang`, `head` with `title`, and `body`.
2. Exactly one visible `main` and one `h1`, and the `h1` matches the page topic.
3. `header`, `nav`, `main`, `footer` are siblings at the top level, not nested inside each other.
4. Every `nav` beyond the first has a distinct `aria-label`.
5. Every `section` has a heading, and the heading is referenced by `aria-labelledby` when the label must be explicit.
6. Every `article` has a heading and would make sense on its own.
7. The `aside`, if present, holds optional content only.
8. Heading levels never skip, and no heading is chosen for its size.
9. The skip link is the first focusable element and points at `main` with `tabindex="-1"`.
10. `figure` is used only for content the text refers to, and `figcaption` is first or last inside it.
11. `details` has `summary` as its first child and no essential content hidden when closed.
12. No ARIA role repeats a native role, and no `div` pretends to be a control.
13. The page can be operated with Tab, Enter and Space alone.
14. The accessibility tree in the browser devtools shows the landmarks you intended, with distinct names.
