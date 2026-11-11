---
id: css-flexbox-deep
lang: CSS
title: Flexbox in depth
---

# Flexbox in depth

## Simplest form

```css
/* Data shape: one parent box and its direct children
   .toolbar       the flex container, display: flex turns it into one
   .toolbar > *   each direct child becomes a flex item
*/
.toolbar {
  display: flex;
}
```

## What it does

Flexbox lays out the children of one element in a single line, then lets you decide
how that line is filled, wrapped, aligned and distributed. The parent is the flex
container. The direct children are flex items. Grandchildren are not items and are
laid out by their own rules.

The important mental shift: flex does not place items at coordinates. It distributes
space along an axis. You describe rules, the browser measures the content, and the
result comes out of the measurement. That is why two items with `flex: 1` can end up
different widths once long words get involved.

Flexbox is one dimensional. The items flow along one line, and a second line only
appears if you ask for wrapping. When the design needs rows and columns at the same
time, grid does the job with less fighting.

## The two axes

Every flex container has a main axis and a cross axis. The main axis is the direction
items flow. The cross axis is perpendicular to it.

With the default `flex-direction: row`, the main axis runs left to right and the cross
axis runs top to bottom. Change the direction and the axes swap roles. `justify-content`
always works on the main axis and `align-items` always works on the cross axis, so in a
column layout `justify-content: center` centers vertically.

The axes also follow the writing mode. In a right to left document the default row
starts on the right. `flex-start` means the start of the main axis, not "left".

## Every container property

### display

`display: flex` makes a block level container that takes the full available width.
`display: inline-flex` makes the container shrink to its content and sit in a line of
text. Both create items; only the outer display changes.

### flex-direction

`row` is the default, items in source order from the main start. `row-reverse` keeps
the items in the DOM but paints them from the other end. `column` stacks them, and
`column-reverse` stacks them from the bottom.

In a column container, the main axis is vertical, so the height of the container is the
main size. A column with `height: auto` has no free space to distribute, which is why
`justify-content: center` on a column sometimes appears to do nothing. Give the column
a height, or use `min-height`, before you expect vertical distribution.

### flex-wrap

The default is `nowrap`. Items shrink and, if they cannot shrink enough, they overflow
the container. `wrap` sends items to a new line when the line is full. `wrap-reverse`
wraps upward from the cross end.

Wrapping creates lines. A line is not an element, you cannot select it, and each line
is sized and aligned separately. That is the reason `align-content` exists at all.

### flex-flow

Shorthand for the two properties above. `flex-flow: row wrap` is the common pair, and
`flex-flow: column nowrap` is the common column.

### justify-content

Distributes free space along the main axis.

- `flex-start` packs items at the main start, the default.
- `flex-end` packs them at the main end.
- `center` packs them in the middle.
- `space-between` puts the first item at the start, the last at the end, equal gaps between.
- `space-around` gives each item equal space on both sides, so outer gaps are half size.
- `space-evenly` gives equal gaps everywhere, including the edges.

Two behaviours catch people. With `space-between` and a wrapped last line that holds one
item, that item sits at the start and the rest of the line stays empty, because the
alignment is computed per line. And none of these values do anything if the items
already fill the main axis, since there is no free space left to distribute.

### align-items

Aligns items on the cross axis within their line.

- `stretch` is the default. An item with `height: auto` grows to the line height. That is why cards in a row look equal until you set a height on one of them.
- `flex-start` and `flex-end` align to the cross start and cross end.
- `center` centers each item on the cross axis.
- `baseline` lines up the first baseline of the text, which is what you want for a row of labels with different font sizes.

An item with a definite cross size and `margin: auto` on the cross axis ignores
alignment, because auto margins eat the free space first.

### align-content

Distributes space between the lines of a multi-line container. It has no effect when
there is one line, so `flex-wrap: nowrap` makes it a no-op. Default is `stretch`, which
spreads the lines to fill the cross size. Values match `justify-content` plus
`space-between`, `space-around`, `space-evenly`, and `stretch`.

If you set `align-content: center` and see nothing change, check that the container
actually wrapped and that it has spare cross size.

### gap

`gap: 16px` sets the space between items and between lines. It replaces the margin
hacks and it does not add space at the outer edges, so the container stays flush with
its parent. Two values mean row gap then column gap: `gap: 12px 24px`.

Gap applies to flex containers in every current browser. Older Safari needed margins;
that era is over, and margins in a flex row still cause the last item to sit off the
edge unless you use a negative margin on the container.

## Every item property

### flex-grow

A unitless number, default `0`. When the container has free space, the value is the
share of that space the item takes. Two items with grow `1` and `2` split the free
space one third and two thirds. Grow only distributes leftovers. It never makes an item
smaller, and it respects `max-width`.

### flex-shrink

A unitless number, default `1`. When items overflow, shrink decides how much each one
gives up. The reduction is weighted by the item's base size, so a wide item loses more
pixels than a narrow one even with the same shrink factor. `flex-shrink: 0` locks the
item, which is how you keep an icon or a button at full size while the text next to it
gives way.

There is a floor. An item refuses to go below its automatic minimum size, which is
roughly the width of its longest unbreakable word. Long URLs and long German nouns
therefore stop the shrink and overflow the row. `min-width: 0` removes that floor.

### flex-basis

The starting main size, before grow and shrink run. `auto` means look at `width` (or
`height` in a column), and if that is also auto, use the content size. A length such as
`200px` sets the starting point and makes `width` irrelevant for the main axis.

`flex-basis: 0` starts every item at zero and lets grow divide the whole container.
That is the difference between equal columns and content-shaped columns.

### flex shorthand

`flex` takes grow, shrink and basis.

- `flex: 1` means `1 1 0%`. Items start at zero and split the space evenly, so three items get equal thirds regardless of content.
- `flex: auto` means `1 1 auto`. Items start at their content size and share whatever is left, so a longer text keeps a wider column.
- `flex: none` means `0 0 auto`. The item keeps its content size and never grows or shrinks.
- `flex: 2 1 200px` starts at 200px and takes twice the free space of a `flex: 1` sibling.
- `flex: initial` is `0 1 auto`, the default, which grows nothing and shrinks when needed.

One number in the shorthand is the common source of "why is my column not equal". If
the content differs, `flex: 1` still gives equal tracks because the basis is zero.
`flex: auto` does not.

### order

An integer, default `0`. Items paint in ascending order. Ties keep source order. `order:
-1` moves an item to the front, `order: 1` to the back.

`order` changes paint order, not tab order and not screen reader order. A layout that
moves a button visually but leaves it last in the DOM is still last for a keyboard user.
Use it for decoration, not for structure that matters.

### align-self

Overrides `align-items` for one item. `auto` inherits the container value. A row of
cards with `align-items: stretch` and one card set to `align-self: flex-start` keeps
that card at its natural height.

### auto margins

`margin-left: auto` on an item absorbs all free space on that side, pushing the item to
the far end. This is the standard way to separate a logo from a nav, or to push a single
button to the right of a toolbar. It works per item and it beats `justify-content`.

## How the sizing runs

The browser resolves the basis of every item, then compares the sum with the container.

1. If the sum is smaller, the free space is split by `flex-grow`.
2. If the sum is larger, the overflow is removed in proportion to `flex-shrink` times the basis.
3. Every result is clamped between the item's minimum and maximum size.
4. If a clamp blocked an item, that item is frozen and the remaining space is distributed again among the rest.

That last step is why a `max-width` on one card can make its neighbour wider. The
algorithm reruns until nothing changes.

## Examples

### Example 1: toolbar with a search field that takes the middle

```html
<header class="toolbar">
  <span class="toolbar__brand">StayEasy</span>
  <input class="toolbar__search" type="search" placeholder="City or hotel name">
  <button class="toolbar__action" type="button">Sign in</button>
</header>
```

```css
.toolbar {
  display: flex;
  align-items: center;   /* logo, field and button share one centre line */
  gap: 16px;
  padding: 12px 24px;
}

.toolbar__search {
  flex: 1 1 240px;       /* starts at 240px, then eats all leftover width */
  min-width: 0;          /* allows the field to shrink below its placeholder width */
  padding: 8px 12px;
}

.toolbar__action {
  flex: none;            /* the button keeps its size while the field gives way */
  padding: 8px 16px;
}
```

The search field is the only growing item, so it absorbs the row. The button is locked
with `flex: none` because a shrinking button loses its padding first and looks broken
before it looks small.

### Example 2: a row of cards that wraps and keeps equal heights

```html
<section class="rooms">
  <article class="room">
    <img class="room__media" src="img/room-1.jpg" alt="Double room with sea view">
    <div class="room__body">
      <h3>Sea view double</h3>
      <p>Two guests, one bed, balcony.</p>
    </div>
    <p class="room__price">80 EUR / night</p>
  </article>
  <article class="room">
    <img class="room__media" src="img/room-2.jpg" alt="Family room with two beds">
    <div class="room__body">
      <h3>Family room</h3>
      <p>Four guests, two beds, extra cot on request.</p>
    </div>
    <p class="room__price">120 EUR / night</p>
  </article>
  <article class="room">
    <img class="room__media" src="img/room-3.jpg" alt="Studio with kitchenette">
    <div class="room__body">
      <h3>Studio</h3>
      <p>Two guests, kitchenette, long stay discount.</p>
    </div>
    <p class="room__price">95 EUR / night</p>
  </article>
</section>
```

```css
.rooms {
  display: flex;
  flex-wrap: wrap;       /* three cards do not fit on a phone, let them drop */
  align-items: stretch;  /* every card in a line gets the same height */
  gap: 24px;
  padding: 24px;
}

.room {
  display: flex;
  flex-direction: column; /* image, text, price stacked inside the card */
  flex: 1 1 260px;        /* at least 260px wide, then share leftover space */
  max-width: 380px;       /* stops one card looking silly on a wide screen */
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.room__media {
  display: block;
  width: 100%;
  height: 180px;
  object-fit: cover;      /* crop instead of squashing the photo */
  flex: none;             /* the image keeps its height, the text absorbs the stretch */
}

.room__body {
  flex: 1;                /* pushes the price to the bottom of every card */
  padding: 16px;
}

.room__price {
  margin: 0;
  padding: 0 16px 16px;
  font-weight: 600;
}
```

The two nested flex contexts do different jobs. The outer one wraps and equalises the
cards. The inner one stacks the parts and uses `flex: 1` on the body so the price line
lands at the bottom even when one description is two lines longer.

### Example 3: a comment with an avatar and truncating text

```html
<li class="comment">
  <img class="comment__avatar" src="img/avatar-1.jpg" alt="">
  <div class="comment__text">
    <p class="comment__author">Guest review, room 204</p>
    <p class="comment__body">The reception desk called a taxi at five in the morning and the driver was already waiting outside. Breakfast opened early for us.</p>
  </div>
  <time class="comment__time" datetime="2026-03-14">14 Mar</time>
</li>
```

```css
.comment {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #e3e6ea;
}

.comment__avatar {
  flex: none;             /* the avatar must not shrink to a sliver */
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.comment__text {
  flex: 1;
  min-width: 0;           /* without this the long line below forces overflow */
}

.comment__body {
  margin: 4px 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;    /* one line, cut with an ellipsis */
}

.comment__time {
  flex: none;
  color: #667085;
  font-size: 13px;
}
```

Drop `min-width: 0` and the text block stops shrinking at its longest word, so the
timestamp gets pushed out of the row. The rule feels unrelated to the ellipsis but it is
the one that makes the ellipsis possible inside a flex item.

### Example 4: a full page shell, read top to bottom

```html
<body class="page">
  <header class="page__header">
    <span class="page__brand">StayEasy</span>
    <nav class="page__nav" aria-label="Main">
      <a href="index.html">Home</a>
      <a href="rooms.html">Rooms</a>
      <a href="contact.html">Contact</a>
    </nav>
    <button class="page__cta" type="button">Book now</button>
  </header>

  <main class="page__main">
    <aside class="page__filters">
      <h2>Filters</h2>
      <label><input type="checkbox" checked> Breakfast</label>
      <label><input type="checkbox"> Parking</label>
    </aside>

    <section class="page__results">
      <h1>Rooms in Budapest</h1>
      <div class="page__cards">
        <article class="card">Sea view double</article>
        <article class="card">Family room</article>
        <article class="card">Studio</article>
      </div>
    </section>
  </main>

  <footer class="page__footer">
    <p>StayEasy, Budapest, 2026.</p>
  </footer>
</body>
```

```css
/* The page is a column that is at least as tall as the viewport.
   The main area grows, so the footer sits at the bottom on a short page
   and after the content on a long one. No fixed heights anywhere. */
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;      /* not height: 100vh, which clips long content */
  margin: 0;
}

/* Header: brand on the left, nav next to it, button pushed to the far end
   by an auto margin. The auto margin is why the button needs no wrapper. */
.page__header {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px 24px;
  background: #10202f;
  color: #fff;
}

.page__brand {
  flex: none;
  font-weight: 700;
}

.page__nav {
  display: flex;          /* the links are the items of this inner container */
  gap: 16px;
}

.page__nav a {
  color: inherit;
  text-decoration: none;
}

.page__cta {
  margin-left: auto;      /* absorbs all remaining space on the left of the button */
  flex: none;
  padding: 8px 16px;
}

/* Main area: filters beside results. align-items: flex-start keeps the
   sidebar at its natural height instead of stretching it down the page. */
.page__main {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  flex: 1;                /* takes the free height so the footer is pushed down */
  padding: 24px;
}

.page__filters {
  flex: 0 0 220px;        /* fixed width sidebar: no grow, no shrink, 220px basis */
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.page__results {
  flex: 1;
  min-width: 0;           /* lets the card row shrink instead of overflowing */
}

/* Card row inside the results area. It wraps on a narrow column because
   the basis of each card is 240px, and flex: 1 stretches the last line. */
.page__cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card {
  flex: 1 1 240px;
  min-height: 120px;
  padding: 16px;
  background: #f4f6f8;
  border-radius: 8px;
}

.page__footer {
  flex: none;
  padding: 16px 24px;
  background: #10202f;
  color: #cbd5e1;
}

/* On a narrow screen the sidebar moves above the results and the row
   turns into a column. The DOM order stays the same, so reading order
   and tab order still match what a sighted user sees. */
@media (max-width: 800px) {
  .page__main {
    flex-direction: column;
    align-items: stretch;
  }

  .page__filters {
    flex: none;           /* in a column the basis applies to height, so reset it */
  }
}
```

Read it in three passes. First the outer column: header, main, footer, with `flex: 1` on
main and `min-height` on the page. That single rule is the sticky footer. Then the
header row: `align-items: center`, one auto margin, two nested flex containers. Then
the content row: a locked sidebar, a growing results column, and a wrapped card row
inside it.

The media query only changes direction. Nothing gets duplicated, no element is hidden,
and the sidebar keeps its place in the source.

## Common mistakes

`flex: 1` and `flex: auto` treated as the same. They differ in the basis. `flex: 1`
starts at zero, so columns are equal. `flex: auto` starts at the content width, so a
longer text keeps a wider column.

Expecting `align-content` to work on a single line. Without `flex-wrap: wrap` there is
one line, and there is nothing to distribute.

Expecting `justify-content: center` to centre a column vertically when the column has
auto height. The main axis has no free space, so centering has nothing to do. Add
`min-height`.

Forgetting `min-width: 0` on a shrinking item. The automatic minimum size is the
longest word, and that floor is what causes the overflow, not the flex settings.

Setting `width` on a flex item and expecting it to win. `flex-basis` overrides `width`
on the main axis. Use `basis` or leave the shorthand alone.

Using margins instead of `gap`. Margins add space at the outer edges too, so the first
and last item sit off the container padding unless you compensate.

Using `order` to move a primary button before the content in the DOM. The visual order
changes, keyboard order does not. Search engines and assistive tech follow the DOM.

Letting `align-items: stretch` stretch an image. An `img` has an intrinsic size and
will distort when the cross size is forced. Set `align-self: flex-start` or a fixed
height with `object-fit: cover`.

Building a two dimensional layout from nested flex rows and columns when the structure
is really a grid. Nested flex works, but each level adds a wrapper and a rule, and the
alignment of rows stops matching across columns.

Relying on `height: 100%` inside a flex column. A percentage height needs a definite
parent height, and `min-height` is not definite. Use `flex: 1` or `min-height: 0` plus
`overflow: auto` for a scrolling panel.

## Exam checklist

- Can you say which property works on the main axis and which on the cross axis, and what changes when the direction is `column`?
- Do you know the computed values behind `flex: 1`, `flex: auto` and `flex: none`?
- Can you explain why a flex item overflows despite `flex-shrink: 1`, and name the two fixes?
- Do you know when `align-content` has an effect and when it is silently ignored?
- Can you centre one item on both axes in a flex container without a wrapper?
- Can you build a sticky footer with `min-height` and one `flex: 1`?
- Do you know the difference between `gap` and margins in a flex row?
- Can you predict what `justify-content: space-between` does to a wrapped last line with one item?
- Do you know why `order` is risky for anything a keyboard user must reach?
- Can you read a nested flex layout and state which container each property applies to?
