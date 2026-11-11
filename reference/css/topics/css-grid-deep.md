# CSS Grid in depth

CSS topic · Exam Wiki

## Simplest form

```css
/* Data shape: one container and its direct children
   .grid      becomes a grid container, one column by default
   .grid > *  each child fills one cell, in source order
*/
.grid {
  display: grid;
}
```

## What it does

Grid lays items out in rows and columns at the same time. You describe the track
structure, and items drop into cells. Unlike flex, the container owns both axes, so
alignment of one row cannot drift out of sync with the row below it.

Three things follow from that. Tracks can be sized in fractions of the leftover space.
Items can be placed by line number, by name, or by named area. Empty track space stays
in the structure instead of collapsing, unless you explicitly ask for it to collapse.

Grid is two dimensional, and it shines when the design is a page layout, a gallery with
a featured tile, or a form where labels and fields line up across rows.

## The vocabulary

A track is a row or a column. A line is the boundary between tracks, and lines are
numbered from 1. A cell is the intersection of one row and one column. An area is a
rectangle of cells, which may span several tracks.

The explicit grid is what you declare with `grid-template-columns` and
`grid-template-rows`. The implicit grid is what the browser adds when items do not fit
in the declared cells. Implicit tracks are sized by `grid-auto-rows` and
`grid-auto-columns`, and their count comes from the number of items.

Negative line numbers count from the end. `-1` is always the last line, which is why
`grid-column: 1 / -1` spans the full width no matter how many columns exist. Pair `1`
with `-1` and the rule survives a change to the track count.

## Every container property

### display

`display: grid` makes a block level container. `display: inline-grid` shrinks it to its
content. Both create grid items from the direct children only.

### grid-template-columns

The track list, left to right. `200px 1fr` is a fixed sidebar and a fluid main column.
`repeat(3, 1fr)` is three equal columns. `repeat(4, 80px)` is four fixed columns. Mixed
lists are allowed: `120px 1fr 2fr 80px`.

`fr` means a fraction of the free space, where free space is what remains after the
fixed tracks and the gaps are subtracted. `2fr` takes twice as much as `1fr`. A track
declared as `1fr` is really `minmax(auto, 1fr)`, so a long unbreakable word can push it
wider than its share.

### minmax

`minmax(min, max)` gives a track a floor and a ceiling. `minmax(240px, 1fr)` never goes
below 240px and grows to share the rest. `minmax(0, 1fr)` removes the automatic minimum
and lets the track shrink below its content, which is the fix for a wide table or a long
code line overflowing its column.

`min-content` and `max-content` are valid bounds and are often what you want for
content sized tracks. `minmax(min-content, 320px)` never shrinks past the longest word
and never grows past 320px.

### repeat and auto-fill, auto-fit

`repeat(auto-fill, minmax(240px, 1fr))` creates as many 240px tracks as fit, and every
track keeps its share of the free space even when no item lands in it. The result is a
row that looks full at the left and has empty tracks at the right when items run out.

`repeat(auto-fit, minmax(240px, 1fr))` does the same count, then collapses the empty
tracks to zero. The items that exist expand to fill the row. With one item and auto-fit,
the item takes the whole width; with auto-fill it takes one 240px track and the rest of
the row is empty space.

That difference matters. A gallery with a fixed number of photos usually wants
`auto-fill`, because a lone card should stay card sized. A fluid card row often wants
`auto-fit`, because the last row should stretch.

`repeat()` also takes an integer, and the two forms cannot be mixed in one function:
`repeat(auto-fit, ...)` is all auto, `repeat(3, ...)` is all fixed.

### grid-template-rows

Sizes the explicit rows. Often left alone, because row heights usually come from content.
`grid-template-rows: auto 1fr auto` is the classic app frame: header, scrollable middle,
footer.

`minmax(0, 1fr)` on a row is how you let an inner panel scroll instead of stretching the
whole page.

### grid-auto-rows

Sizes rows the browser creates on its own. Default is `auto`, which means each row is as
tall as its tallest item, so rows can differ. `grid-auto-rows: 200px` makes every
implicit row exactly 200px, and `grid-auto-rows: minmax(200px, auto)` gives a floor with
room to grow. Use this for card galleries that need equal tiles.

### grid-auto-flow

`row` is the default: items fill each row before the next. `column` fills down a column
first. `dense` lets the algorithm backfill holes left by items that span several cells,
which can reorder the visual result against the DOM. `grid-auto-flow: row dense` is the
usual combination for a gallery with a featured tile.

### gap

`gap: 24px` sets row and column gaps together. `gap: 12px 24px` is row gap then column
gap. Gap applies between tracks only, never at the outer edges, and it is subtracted
from the free space before `fr` is calculated.

### justify-items and align-items

`justify-items` aligns items inside their cell horizontally. `align-items` does the same
vertically. Values are `stretch` (the default), `start`, `end`, `center`. `place-items:
center` sets both and is the shortest way to centre one child in a grid cell.

These align the item, not the tracks. To move the whole track structure inside a
container that has spare space, use `justify-content` and `align-content`, which take
the same values plus `space-between`, `space-around` and `space-evenly`. Track alignment
only shows up when the tracks are smaller than the container.

### grid-template-areas

A visual map of the layout, one string per row, each string holding the same number of
names as there are columns. A dot means an empty cell. Repeated names make an area span.
Every area must form a rectangle; an L shape is invalid and the declaration is dropped.

```css
.layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}
```

This one declaration replaces a dozen placement rules and it reads like the finished
page.

## Every item property

### grid-column and grid-row

Each takes `start / end`. Line numbers come from the track boundaries. In a three column
grid the lines are 1 through 4, so `grid-column: 2 / 4` starts at line 2 and ends at line
4, covering two columns.

`span` counts cells instead of naming a line: `grid-column: span 2` covers two columns
from wherever the item lands. `grid-column: 1 / -1` covers the full row.

You can also write a single value, `grid-column: 2`, which means start at line 2 and span
one cell.

### grid-area

Two forms. Four numbers, in the order row start, column start, row end, column end:
`grid-area: 2 / 1 / 3 / 3`. Or a name that matches an entry in `grid-template-areas`:
`grid-area: header`. The four value form is easy to get wrong because the order is not
clockwise; read it as a set of line pairs.

Items may overlap when their areas intersect. Later items paint on top, and `z-index`
works on grid items without `position: relative`.

### justify-self and align-self

Per item versions of the container alignment. `align-self: start` keeps one card at the
top of a stretched row.

### order

Rarely needed in grid, because placement does the job. It works the same way as in flex
and it carries the same accessibility warning.

## Examples

### Example 1: a responsive card grid with no media query

```html
<section class="gallery">
  <article class="gallery__card">Sea view double</article>
  <article class="gallery__card">Family room</article>
  <article class="gallery__card">Studio</article>
  <article class="gallery__card">Loft</article>
  <article class="gallery__card">Twin</article>
</section>
```

```css
.gallery {
  display: grid;
  /* As many columns as fit at 240px minimum. auto-fit collapses empty
     tracks, so a short last row stretches instead of leaving a hole. */
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  padding: 24px;
}

.gallery__card {
  min-height: 120px;
  padding: 16px;
  background: #f4f6f8;
  border-radius: 8px;
}
```

At 1000px of content width the browser fits four 240px tracks with 24px gaps, and the
`1fr` ceiling shares the leftover pixels between them. At 500px it fits one. No
breakpoint is involved, and the rule survives a container that changes width for reasons
unrelated to the viewport, such as a sidebar opening.

Swap `auto-fit` for `auto-fill` and the count stays the same but the tracks stop
stretching, so three cards on a wide screen sit in three 240px slots at the left.

### Example 2: page layout with template areas

```html
<div class="layout">
  <header class="layout__header">StayEasy</header>
  <nav class="layout__nav" aria-label="Main">
    <a href="index.html">Home</a>
    <a href="rooms.html">Rooms</a>
  </nav>
  <main class="layout__main">
    <h1>Rooms</h1>
  </main>
  <aside class="layout__aside">Filters</aside>
  <footer class="layout__footer">2026</footer>
</div>
```

```css
.layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-rows: auto auto 1fr auto;
  grid-template-areas:
    "header header"
    "nav    nav"
    "aside  main"
    "footer footer";
  gap: 16px;
  min-height: 100vh;
}

/* Each selector is one line, and the name matches the map above.
   No numbering, so the map can be redrawn without touching these. */
.layout__header { grid-area: header; }
.layout__nav    { grid-area: nav; }
.layout__main   { grid-area: main; min-width: 0; }
.layout__aside  { grid-area: aside; }
.layout__footer { grid-area: footer; }

/* One breakpoint redraws the map. The items keep their area names,
   so nothing inside them changes. */
@media (max-width: 760px) {
  .layout {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "nav"
      "main"
      "aside"
      "footer";
  }
}
```

The `1fr` row on `main` makes the content area absorb the height, so the footer lands at
the bottom. `min-width: 0` on main stops a wide child from widening the track.

If you get a blank layout after editing the map, count the names in one string against
the number of columns. A mismatch invalidates the whole declaration.

### Example 3: a featured tile with dense flow

```html
<section class="news">
  <article class="news__item">Breakfast hours extended</article>
  <article class="news__item news__item--feature">Winter rates are live</article>
  <article class="news__item">New parking deck</article>
  <article class="news__item">Reception moves to the ground floor</article>
  <article class="news__item">Pet policy update</article>
</section>
```

```css
.news {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 120px;
  gap: 16px;
  /* dense lets a later item backfill a hole an earlier span left behind.
     The trade-off: paint order stops matching source order. */
  grid-auto-flow: row dense;
}

.news__item {
  padding: 16px;
  background: #eef2f6;
}

.news__item--feature {
  grid-column: span 2;   /* two columns wide */
  grid-row: span 2;      /* two rows tall */
  background: #10202f;
  color: #fff;
}
```

Without `dense`, the feature tile leaves a hole and the next item starts after it, which
is fine when source order matters. With `dense`, a small item slides into the hole and
the grid looks tighter but reads out of order. Pick based on whether the DOM order is
meaningful.

### Example 4: a full booking page, read top to bottom

```html
<div class="shell">
  <header class="shell__top">
    <span class="shell__brand">StayEasy</span>
    <nav class="shell__nav" aria-label="Main">
      <a href="index.html">Home</a>
      <a href="rooms.html">Rooms</a>
    </nav>
  </header>

  <div class="shell__filters">
    <h2>Filters</h2>
    <label><input type="checkbox" checked> Breakfast</label>
    <label><input type="checkbox"> Parking</label>
  </div>

  <main class="shell__main">
    <h1>Rooms in Budapest</h1>

    <div class="cards">
      <article class="card">
        <img class="card__img" src="img/room-1.jpg" alt="Double room with sea view">
        <div class="card__text">
          <h2>Sea view double</h2>
          <p>80 EUR / night</p>
        </div>
      </article>
      <article class="card card--wide">
        <img class="card__img" src="img/room-2.jpg" alt="Family room with two beds">
        <div class="card__text">
          <h2>Family room</h2>
          <p>120 EUR / night, sleeps four</p>
        </div>
      </article>
      <article class="card">
        <img class="card__img" src="img/room-3.jpg" alt="Studio with kitchenette">
        <div class="card__text">
          <h2>Studio</h2>
          <p>95 EUR / night</p>
        </div>
      </article>
    </div>
  </main>

  <aside class="shell__promo">
    Late checkout included on every booking.
  </aside>

  <footer class="shell__foot">
    <p>StayEasy, Budapest, 2026.</p>
  </footer>
</div>
```

```css
/* Outer grid: the page frame. Two columns, four rows, all named.
   The map is the layout; the selectors below only attach names. */
.shell {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  grid-template-rows: auto auto 1fr auto;
  grid-template-areas:
    "top     top"
    "filters main"
    "filters promo"
    "foot    foot";
  gap: 20px;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

.shell__top {
  grid-area: top;
  display: flex;              /* a header is a line, flex is the right tool here */
  align-items: center;
  gap: 24px;
  padding: 12px 16px;
  background: #10202f;
  color: #fff;
}

.shell__nav {
  display: flex;
  gap: 16px;
  margin-left: auto;          /* pushes the links to the far end */
}

.shell__nav a { color: inherit; text-decoration: none; }

/* The sidebar spans the filters and promo rows. Naming the same area twice
   in the map stretches it, so no line numbers are needed here. */
.shell__filters {
  grid-area: filters;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: #f4f6f8;
  border-radius: 8px;
}

/* minmax(0, 1fr) in the column list plus min-width: 0 here keeps a wide
   card row from pushing the track wider than the viewport. */
.shell__main {
  grid-area: main;
  min-width: 0;
}

.shell__promo {
  grid-area: promo;
  padding: 16px;
  background: #e8f1ff;
  border-radius: 8px;
}

.shell__foot {
  grid-area: foot;
  padding: 16px;
  background: #10202f;
  color: #cbd5e1;
}

/* Inner grid: the card row. auto-fit plus minmax gives a responsive
   gallery, and grid-auto-rows makes every tile the same height even
   when one description is longer. */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  grid-auto-rows: minmax(240px, auto);
  gap: 16px;
}

.card {
  display: grid;
  grid-template-rows: 140px 1fr;  /* fixed image band, text takes the rest */
  overflow: hidden;
  background: #fff;
  border: 1px solid #e3e6ea;
  border-radius: 8px;
}

.card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card__text { padding: 12px; }
.card__text h2 { margin: 0 0 4px; font-size: 16px; }
.card__text p { margin: 0; color: #667085; }

/* The featured card spans two columns when there is room. Inside a
   single column track the span is clamped to one, so nothing breaks. */
.card--wide { grid-column: span 2; }

@media (max-width: 900px) {
  .shell {
    grid-template-columns: 1fr;
    grid-template-areas:
      "top"
      "filters"
      "main"
      "promo"
      "foot";
  }

  .card--wide { grid-column: span 1; }
}
```

The file has three grids, each doing one job. The shell places the frame. The cards
container handles the repeat and the tile heights. Each card splits its own image and
text. That nesting is normal and it is why grid scales: a container only needs to know
its own tracks.

The `minmax(0, 1fr)` in the shell column list and the `min-width: 0` on main are the same
fix twice, because both the track and the item can refuse to shrink below content.

## Common mistakes

Writing `repeat(auto-fit, 240px)` and expecting the tracks to stretch. Without a `1fr`
ceiling there is no free space to share, so the tracks stay at 240px and a gap appears at
the right edge.

Using `1fr` and then wondering why a long word overflows the column. `1fr` is
`minmax(auto, 1fr)`, and the automatic minimum is min-content. Use `minmax(0, 1fr)` or
`min-width: 0` on the item.

Expecting an L shaped area to work in `grid-template-areas`. Areas must be rectangles.
Repeating a name in a diagonal makes the declaration invalid and the browser ignores the
whole map.

Counting area names wrong. Every string in the map must describe the same number of
columns as the track list. One extra space breaks the layout silently.

Confusing `align-items` with `align-content`. The first aligns an item inside its cell,
the second moves the whole track structure inside the container, and the second only
shows when tracks are smaller than the container.

Placing items with line numbers and then changing the track count. `grid-column: 3 / 5`
breaks when the grid drops to two columns. `1 / -1` and `span 2` survive more edits.

Forgetting that implicit rows exist. Items beyond the declared rows get auto rows, and
those rows are as tall as their content, so a gallery looks uneven until
`grid-auto-rows` is set.

Adding gap and then computing widths as percentages. Percentage track widths resolve
against the content box, and gaps come out of the same space, so `33.33% 33.33% 33.33%`
plus two gaps overflows. Use `fr` and let the browser subtract the gaps.

Using gap at the outer edge. Gap never adds padding around the grid, so the first card
sits flush with the container. Padding on the container is the correct fix.

Reaching for `dense` because it looks tidier. It reorders paint relative to the DOM, so
a keyboard user tabs through items in a different sequence than the eye follows.

Using grid for a single row of two buttons. Flex is one declaration and reads closer to
the intent. Grid pays off when both axes carry structure.

Setting a fixed `height` on the grid container to make rows fill it. `min-height` plus a
`1fr` row does the job without clipping content.

## Exam checklist

- Can you explain what `fr` resolves against, and what happens to fixed tracks and gaps first?
- Do you know the difference between `auto-fill` and `auto-fit`, including what each does with a single item?
- Can you write a responsive card grid with one rule and no media query?
- Can you read `grid-area: 2 / 1 / 3 / 3` and state which cells it covers?
- Do you know why `grid-column: 1 / -1` is safer than counting columns?
- Can you convert a layout described in words into a `grid-template-areas` map, and state the rectangle rule?
- Do you know which property aligns items inside a cell and which aligns the tracks themselves?
- Can you explain the overflow that `1fr` causes with long content, and name two fixes?
- Do you know what creates an implicit row and how to size one?
- Can you nest a grid inside a grid item and say which element each rule applies to?
- Do you know the accessibility cost of `grid-auto-flow: dense` and of `order`?

