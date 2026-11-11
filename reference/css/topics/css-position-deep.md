# CSS positioning

CSS topic · Exam Wiki

## Simplest form

```css
/* Data shape: position picks the mode, inset gives the four offsets.
   position: static | relative | absolute | fixed | sticky */
.box {
  position: absolute;
  inset: 0;               /* top: 0; right: 0; bottom: 0; left: 0; */
}
```

A box is in normal flow until `position` says otherwise. `static` is the default and ignores offsets. Every other value lets `top`, `right`, `bottom`, `left` and the `inset` shorthand move the box, but each one moves it against a different reference. That reference is the part most people get wrong, so the sections below name it for each value.

## What it does

Positioning answers one question per element: what is this box measured against, and does it still take up space in the flow?

Normal flow places block boxes one under another and inline boxes along a line. `static` stays in that flow and does nothing else. `relative` stays in the flow but paints and measures itself shifted from where it would have been. `absolute` leaves the flow entirely and is measured against a containing block. `fixed` also leaves the flow, measured against the viewport. `sticky` is the odd one: it stays in flow like `relative`, and once the scroll position passes a threshold it behaves like `fixed` until its parent scrolls away.

The visual effect of leaving the flow is that the space the element used to occupy collapses. Siblings move up or left to fill it. This is why an absolutely positioned dropdown does not push the paragraph under it down.

## Every part

### static

The initial value. Offsets, `z-index` and `inset` have no effect. An element with `position: static` cannot be a containing block for absolute children through positioning, though it can through other properties listed below.

### relative

The box stays in flow, so it keeps its space. Offsets shift the painted box without moving the space it reserved. A `top: 8px` on a relatively positioned heading moves the visible text down 8px while the gap below the heading stays where it was, and the heading can now overlap the content that follows.

`relative` with no offsets is common and useful. It changes nothing visually, but it makes the element a containing block for `absolute` children. That is the standard pattern for badges, dropdown menus and overlays.

Two side effects matter for exams. A relatively positioned element creates a stacking context only when its `z-index` is not `auto`, and it is painted above non positioned siblings, which can hide a border or a shadow.

### absolute

The box is removed from flow and its static position is discarded. Its size and place come from offsets, from its own `width` and `height`, and from the containing block. If both `left` and `right` are set and `width` is `auto`, the box stretches between them. If only one side is set, the box keeps its intrinsic width and is placed at that side. If neither side is set, it sits at its static position, which is where it would have been in flow.

Percentages in offsets resolve against the containing block's width for left and right, and against its height for top and bottom. A percentage `top` inside an auto height parent usually collapses to zero, which surprises people.

The containing block is the padding box of the nearest ancestor whose `position` is not `static`. If no such ancestor exists, it is the initial containing block, which is the viewport sized block at the root.

### fixed

Measured against the viewport, not against the document. Scrolling does not move it. The catch is that a few properties on an ancestor take over the job of the viewport: `transform`, `filter`, `perspective`, `backface-visibility: hidden`, `will-change` naming any of those, `contain: paint` or `layout`, and `content-visibility: auto`. When an ancestor has one of them, a `fixed` child positions against that ancestor instead and scrolls with it. This is the usual explanation for a fixed navbar that starts to drift inside a page wrapper with a transform animation.

On phones, `position: fixed` and the on screen keyboard interact badly. A fixed footer can jump above the keyboard, and `bottom: 0` can land under the browser toolbar. `dvh` units and `env(safe-area-inset-bottom)` reduce the damage, but no CSS fully removes it.

### sticky

Sticky keeps the element in flow and, while scrolling, pins it to an offset inside its scroll container. The element can never leave its parent: when the parent's bottom edge reaches the pinned element, the element scrolls away with it. That parent boundary is why a sticky header inside a short card stops sticking halfway down the page.

For sticky to work, all of these must be true:

- The element has a threshold, one of `top`, `right`, `bottom`, `left` with a value other than `auto`.
- The parent is taller than the element, otherwise there is no room to travel.
- No ancestor between the element and the scroll container has `overflow: hidden`, `overflow: auto` or `overflow: scroll` with a height that clips the element. An `overflow: hidden` ancestor becomes the scroll container even if it never scrolls, and the element then has nothing to stick against.
- The element is not `display: table-cell` or otherwise unable to leave its formatting context in the way sticky needs.

Sticky is the cheapest way to keep table headers, section labels and filter bars visible. It needs no JavaScript and no scroll listener.

### inset and the four offsets

`inset` is the shorthand for `top`, `right`, `bottom`, `left`, in that order. `inset: 0` is the common full cover. `inset: 10px 20px` means 10px top and bottom, 20px left and right. `inset: auto` restores the initial value.

Logical versions exist: `inset-block-start`, `inset-inline-start`, `inset-block`, `inset-inline`. `inline` follows the writing direction, so in English it is left and right, but in Arabic or Hebrew it flips. Use logical properties when the page may be translated.

`inset: 0` on an absolutely positioned element with `width: auto; height: auto` stretches it to fill its containing block. That is the shortest overlay. On a replaced element such as `img`, the stretch does not happen the same way and the image keeps its intrinsic size.

`auto` is not zero. It means "use the static position" for an absolute box, and "no threshold" for a sticky box.

### Over-constrained offsets

If `left`, `right` and `width` are all set, the browser has too much information. In left to right text it drops `right`. If `left` and `right` are set with `width: auto`, the box stretches. If `width` is set and only one of `left` or `right` is set, the box is placed from that side. Vertical rules are the same with top and bottom, and the bottom value is the one that gets ignored when the box cannot grow.

Writing `margin: auto` on a box with `left: 0; right: 0; width: 300px` centers it horizontally inside the containing block. That is the classic absolute centering trick. `inset: 0; margin: auto; width: 300px; height: 200px` centers on both axes, but the modern `display: grid; place-items: center` on the parent is easier to read.

### z-index

`z-index` decides paint order among boxes in the same stacking context. It accepts an integer, negative values allowed, and `auto`. It only applies to positioned elements, that is any `position` other than `static`, and to flex and grid items, which may use it without being positioned.

Bigger numbers paint later, so they appear on top. Values do not need to be large. A scale of 0, 10, 20, 30, 100 covers most pages and leaves room to insert a layer later. Two elements with the same value are painted in document order, later one on top.

`z-index` does not cross stacking contexts. A child with `z-index: 9999` inside a parent that has `z-index: 1` still loses to a sibling of the parent with `z-index: 2`. This is the single most common reason a modal ends up behind a header. The fix is to raise the parent's value or to move the modal in the DOM, not to add nines.

### Stacking contexts

A stacking context is a self contained paint group. An element creates one when:

- It is the root element.
- It is positioned with a `z-index` other than `auto`.
- It is a flex or grid item with a `z-index` other than `auto`.
- It has `opacity` below 1.
- It has a `transform`, `filter`, `perspective`, `clip-path`, `mask` or `backdrop-filter` other than none.
- It has `isolation: isolate`.
- It has `mix-blend-mode` other than normal.
- It has `contain: layout` or `paint`, or `content-visibility: auto`.
- It has `will-change` naming any property that would create one.
- It is a container query container with `container-type: size` or `inline-size`.

`isolation: isolate` is worth remembering. It creates a context without any visual side effect, which is exactly what you want when a component must not fight with the page.

Within a context, boxes paint in this order: background and borders of the context element, negative `z-index` children, block level in flow boxes, floats, inline content, positive `z-index` children. Positioned boxes with `z-index: auto` paint with the positioned group at step six.

### When to use which

`relative` is a positioning anchor, not a movement tool. `absolute` handles badges, tooltips, dropdown panels, decorative shapes and image overlays, anything that must sit over a known box without pushing content. `fixed` handles the app chrome that must survive scrolling, with the caveat about transformed ancestors. `sticky` handles section headers, table headers and sidebars that should stay visible only while their section is on screen. If a layout can be done with flow, flex or grid, those are still the first choice, because they keep siblings in predictable places.

## Examples

### Example 1: a corner badge on a card

The card is the anchor. The badge is taken out of flow and pinned to the top right corner of the card's padding box.

```html
<article class="card">
  <img class="card__image" src="room.jpg" alt="Room with a window and a desk">
  <span class="card__tag">New</span>
  <div class="card__body">
    <h3 class="card__title">Double room</h3>
    <p class="card__text">Two beds, a desk and a window facing the yard.</p>
  </div>
</article>
```

```css
.card {
  position: relative;        /* the containing block for .card__tag */
  overflow: hidden;          /* the badge cannot spill over the rounded corner */
  border: 1px solid #d8dde6;
  border-radius: 12px;
  background: #fff;
}

.card__image {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.card__tag {
  position: absolute;
  top: 12px;                 /* measured from the padding edge of .card */
  right: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #123f6d;
  color: #fff;
  font-size: 12px;
}

.card__body {
  padding: 12px 16px 16px;
}

.card__title {
  margin: 0 0 6px;
  font-size: 18px;
}

.card__text {
  margin: 0;
  color: #445;
}
```

Without `position: relative` on the card, the badge would climb to the nearest positioned ancestor, often the whole page, and appear in a corner far from the card.

### Example 2: a sticky header inside a scrolling log

The list scrolls on its own because `max-height` and `overflow: auto` are set on the wrapper. The header sticks to the top of that scrollport, not to the top of the page.

```html
<section class="log" tabindex="0" aria-label="Build log">
  <h3 class="log__title">Build log</h3>
  <ol class="log__list">
    <li>Read 42 files</li>
    <li>Compile styles</li>
    <li>Bundle scripts</li>
    <!-- more lines, enough to scroll -->
  </ol>
</section>
```

```css
.log {
  max-height: 320px;
  overflow: auto;            /* this box becomes the scrollport */
  border: 1px solid #d8dde6;
  border-radius: 8px;
}

.log__title {
  position: sticky;
  top: 0;                    /* the threshold; without it nothing sticks */
  margin: 0;
  padding: 8px 12px;
  background: #f4f7fb;       /* must be opaque, otherwise lines show through */
  border-bottom: 1px solid #d8dde6;
}

.log__list {
  margin: 0;
  padding: 8px 12px 8px 32px;
  font-family: ui-monospace, monospace;
  font-size: 13px;
}
```

Two things break this example. Adding `overflow: hidden` to an ancestor of the heading removes the stickiness, because that ancestor becomes the scrollport. Removing the background makes the scrolling lines visible behind the heading instead of cleanly passing under it.

### Example 3: a full page with fixed navigation, sticky sidebar and modal

This is the shape of a real documentation layout. Read it top to bottom: the header is fixed, the body is padded by the header height, the sidebar sticks below the header, the modal sits above everything.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Positioning demo</title>
  <style>
    /* One place for layout values that several rules must agree on. */
    :root {
      --header-h: 64px;
      --gap: 24px;
      --z-header: 10;
      --z-dropdown: 20;
      --z-modal-backdrop: 100;
      --z-modal: 110;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font: 16px/1.6 system-ui, sans-serif;
      color: #1c2330;
      /* The header is out of flow, so the first content would slide under it.
         Padding on the body reserves that space once, for the whole page. */
      padding-top: var(--header-h);
    }

    .site-header {
      position: fixed;
      inset: 0 0 auto 0;       /* top right bottom left: pinned to the top edge */
      height: var(--header-h);
      display: flex;
      align-items: center;
      gap: var(--gap);
      padding: 0 var(--gap);
      background: #123f6d;
      color: #fff;
      z-index: var(--z-header);
    }

    .site-header a {
      color: #fff;
      text-decoration: none;
    }

    .layout {
      display: grid;
      grid-template-columns: 220px 1fr;
      gap: var(--gap);
      max-width: 1100px;
      margin: 0 auto;
      padding: var(--gap);
    }

    .sidebar {
      /* Sticky inside the grid column: it travels until the column ends.
         The top offset includes the fixed header, otherwise the header covers it. */
      position: sticky;
      top: calc(var(--header-h) + var(--gap));
      align-self: start;       /* without this the column stretches and sticky has no room */
      max-height: calc(100vh - var(--header-h) - var(--gap) * 2);
      overflow: auto;
      border-right: 1px solid #d8dde6;
      padding-right: 12px;
    }

    .sidebar ul {
      margin: 0;
      padding-left: 18px;
    }

    .content section {
      position: relative;      /* anchor for the required mark */
      padding: 16px 20px;
      border: 1px solid #e3e8ef;
      border-radius: 10px;
      margin-bottom: var(--gap);
    }

    .content .required::after {
      content: "required";
      position: absolute;
      top: 8px;
      right: 8px;
      padding: 2px 8px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      background: #fdecec;
      color: #a02020;
      border-radius: 999px;
    }

    /* The modal pattern. The backdrop covers the viewport and ignores scroll. */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      display: grid;
      place-items: center;
      background: rgb(12 18 28 / 55%);
      z-index: var(--z-modal-backdrop);
    }

    .modal {
      width: min(420px, calc(100% - 32px));
      padding: 20px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 18px 40px rgb(12 18 28 / 25%);
      /* Its own z-index is unnecessary here: the backdrop already owns the layer.
         If it did get one, it would only compete inside the backdrop's context. */
      z-index: var(--z-modal);
    }

    .toast {
      position: fixed;
      bottom: 16px;
      right: 16px;
      padding: 10px 14px;
      background: #123f6d;
      color: #fff;
      border-radius: 8px;
      z-index: var(--z-dropdown);
    }
  </style>
</head>
<body>
  <header class="site-header">
    <strong>Hotel admin</strong>
    <nav><a href="#rooms">Rooms</a></nav>
  </header>

  <div class="layout">
    <aside class="sidebar">
      <ul>
        <li><a href="#rooms">Rooms</a></li>
        <li><a href="#bookings">Bookings</a></li>
      </ul>
    </aside>

    <main class="content">
      <section id="rooms">
        <h2>Rooms</h2>
        <p>Six rooms, two of them with a balcony.</p>
      </section>

      <section id="bookings" class="required">
        <h2>Bookings</h2>
        <p>Every booking needs a customer_email and a start_date.</p>
      </section>
    </main>
  </div>

  <div class="toast" role="status">Saved</div>

  <div class="modal-backdrop" hidden>
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <h2 id="modal-title">Delete booking?</h2>
      <p>This cannot be undone.</p>
    </div>
  </div>
</body>
</html>
```

Three details in that page are easy to miss. The `top` on the sidebar adds the header height, because sticky measures from the scrollport, not from the visible area under the header. The `align-self: start` stops the grid from stretching the sidebar, which would leave no travel room and make sticky look broken. The modal has no page level `z-index` competition because the backdrop already creates the context at 100, and the toast at 20 stays below it.

## Common mistakes

- Putting `top` or `left` on a `static` element and expecting movement. Static ignores every offset.
- Positioning a badge with `absolute` and forgetting `position: relative` on the card, so the badge attaches to the page.
- Expecting an absolutely positioned element to reserve space. It does not, so the next block will move up under it.
- Giving `z-index: 9999` to a child whose parent sits in a lower stacking context. The child cannot escape its parent's layer.
- Fixing a modal that hides behind the header by adding more nines, instead of checking which ancestor creates the context.
- Putting `overflow: hidden` on a page wrapper for a rounded corner, then wondering why `position: sticky` no longer works inside it.
- Using `position: fixed` inside an ancestor with `transform` and getting a navbar that scrolls away.
- Writing `height: 100vh` for a full screen panel on a phone, where the browser toolbar makes the panel taller than the visible area.
- Forgetting that `inset: 0` stretches only when both the width and height are `auto`. A fixed width keeps the box at that width.
- Using `bottom: 0` on an element with `position: sticky` when the parent is not taller than the element, which leaves nothing to stick against.
- Setting `z-index` on an element with `position: static` and no flex or grid parent, where the value is simply ignored.
- Centering with `left: 50%; margin-left: -150px` and then changing the width without updating the margin. `inset: 0; margin: auto` or grid handles it.

## Exam checklist

- Can you name the default value of `position` and say what it does with offsets?
- Can you state which box `absolute` measures against, including the padding box detail and the fallback to the initial containing block?
- Can you list three properties on an ancestor that change the containing block for a `fixed` child?
- Can you explain why `position: sticky` does nothing without an offset, and why a short parent stops it?
- Do you know the order of the four values in `inset`?
- Can you explain why `z-index: 9999` on a child inside a lower context does not win?
- Can you name four ways to create a stacking context without setting `z-index`?
- Can you center a box with `absolute` and with grid, and say which is easier to maintain?
- Can you explain why a fixed header needs padding on the body, and what happens to anchor links if you forget it?
- Can you read a layout and say which elements are in flow and which are not?

