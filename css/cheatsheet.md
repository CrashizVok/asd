# CSS cheatsheet

Condensed reference for the exam. Each block is short on purpose. Read it, then type it.

## Selectors

```css
p            { }   /* every paragraph */
.card        { }   /* class */
#hero        { }   /* id, use once per page */
nav a        { }   /* link inside nav */
ul > li      { }   /* direct child only */
h2 + p       { }   /* paragraph right after h2 */
h2 ~ p       { }   /* all later siblings */
input[type="email"] { }   /* attribute */
[data-open]  { }   /* attribute present */
a:hover      { }   /* pseudo-class */
p::first-line { }  /* pseudo-element */
.card, .panel { }  /* grouping */
```

Universal selector `*` matches everything. Use it for resets, not for styling.

## Specificity

Specificity is a weight, not a count of characters. Four columns: inline style, id, class/attribute/pseudo-class, element/pseudo-element.

```text
style="..."         1,0,0,0
#hero               0,1,0,0
.card:hover         0,0,2,0
nav ul li           0,0,0,3
*                   0,0,0,0
```

Higher wins. Equal weight: the later rule wins. `!important` beats all normal rules, so treat it as a last resort. Keep selectors flat. Three classes beat one deep chain and they are easier to override.

## Box model

Every element is content, padding, border, margin, in that order.

```css
.box {
  width: 300px;
  padding: 16px;
  border: 1px solid #ddd;
  margin: 24px auto;
  box-sizing: border-box; /* width includes padding and border */
}
```

`content-box` is the default: `width` covers content only, so the real size grows. Set `box-sizing: border-box` on `*` and stop guessing. Vertical margins collapse between siblings; padding does not. `margin: 0 auto` centers a block with a set width.

## Display

```css
.block  { display: block; }        /* full width, respects height */
.inline { display: inline; }       /* flows in text, no height */
.inline-block { display: inline-block; }
.none   { display: none; }         /* removed from layout */
.flex   { display: flex; }
.grid   { display: grid; }
```

`display: none` removes the element and its space. `visibility: hidden` keeps the space. `inline-block` sits in a line but accepts width and height.

## Position

```css
.static   { position: static; }   /* default */
.relative { position: relative; top: 8px; left: 8px; }
.absolute { position: absolute; top: 0; right: 0; }
.fixed    { position: fixed; top: 0; left: 0; }
.sticky   { position: sticky; top: 0; }
```

`absolute` positions against the nearest ancestor that is not `static`. That ancestor is usually `position: relative`. `fixed` pins to the viewport and does not scroll. `sticky` switches between normal flow and fixed at a scroll threshold. Positioned elements can use `z-index`; a higher value paints on top.

## Flexbox

One axis at a time. The container decides direction.

```css
.row {
  display: flex;
  gap: 16px;
  justify-content: space-between; /* main axis */
  align-items: center;            /* cross axis */
  flex-wrap: wrap;
}
.row > .item { flex: 1 1 200px; } /* grow shrink basis */
```

`justify-content` works on the main axis, `align-items` on the cross axis. `flex: 1` means grow and shrink equally. `margin-left: auto` on one child pushes it to the far end. Use `gap` instead of margins between items.

## Grid

Two axes. Good for page layouts and card galleries.

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-areas: "side main";
}
```

`auto-fit` with `minmax` gives a responsive card grid without media queries. `fr` splits the free space. `grid-column: 1 / -1` spans the full row. `place-items: center` centers a single child on both axes.

## Media queries

Mobile first: base styles for small screens, then widen.

```css
@media (min-width: 768px) { .grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 600px) { .nav { display: none; } }
@media print { .navbar { display: none; } }
```

Common breakpoints in this repo: 600, 768, 1024. Use `min-width` for content that grows, `max-width` when hiding a desktop nav.

## Variables

```css
:root {
  --brand: #1f6feb;
  --text: #1b1f24;
  --radius: 12px;
  --space: 1rem;
}
.btn { background: var(--brand); border-radius: var(--radius); }
```

Variables cascade and inherit. A child can override one locally. `var(--x, fallback)` supplies a default.

## Transitions

```css
.btn {
  transition: background-color 0.2s ease, transform 0.2s ease;
}
.btn:hover { background-color: #1558b0; transform: translateY(-2px); }
```

Transition the property that actually changes. `all` is slow and unpredictable on big elements. Keep durations between 150 and 300 ms for interface feedback.

## Transforms

```css
.zoom:hover  { transform: scale(1.05); }
.tilt        { transform: rotate(-3deg); }
.lift        { transform: translateY(-4px); }
.card        { transition: transform 0.2s ease; }
```

Transforms do not affect layout, so they are cheap to animate. Combine them in one declaration: `transform: translateY(-4px) scale(1.02)`. Use `transform-origin` to move the pivot.

## Pseudo-classes

```css
li:first-child { }
li:last-child  { }
li:nth-child(2n) { }      /* even items */
input:focus    { outline: 2px solid var(--brand); }
input:invalid  { border-color: #c0392b; }
.card:hover    { }
a:visited      { }
:not(.active)  { }
```

`:focus-visible` targets keyboard focus only, which is the accessible choice for outlines. Never remove a focus outline without a replacement.

## Pattern: full-screen background with centered panel

```css
.hero {
  min-height: 100vh;
  background: url("../img/hotel.jpg") center / cover no-repeat;
  display: grid;
  place-items: center;
}
.panel {
  max-width: 1100px;
  width: calc(100% - 32px);
  padding: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
}
```

`center / cover` centers the image and covers the box. The panel stays readable because it has its own background. `calc(100% - 32px)` keeps a gutter on small screens.

## Pattern: fixed navbar

```css
.navbar {
  position: fixed;
  inset: 0 0 auto 0;   /* top, right, bottom, left */
  height: 64px;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 0 24px;
  background: #10202f;
  color: #fff;
  z-index: 10;
}
body { padding-top: 64px; } /* stop content sliding under it */
```

A fixed bar leaves the flow, so reserve its height on the body. Add `backdrop-filter: blur(8px)` and a transparent background for a glass look.

## Pattern: card grid

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  padding: 24px;
}
.card { background: #fff; border-radius: 12px; overflow: hidden; }
.card img { width: 100%; height: 180px; object-fit: cover; display: block; }
```

`object-fit: cover` stops image distortion. `overflow: hidden` clips the image to the rounded corners.

## Colors and backgrounds

```css
:root {
  --brand: #2563eb;
  --ink: #1f2937;
  --paper: #ffffff;
}

.hero {
  color: var(--ink);
  background-color: var(--paper);
  background-image: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url("hero.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
```

Use hex for a fixed colour, `rgb()` or `hsl()` when you need transparency or a hue. A gradient layer over an image keeps text readable. `background-size: cover` fills the box and may crop.

## Text and fonts

```css
body {
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #1f2937;
}

h1 {
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.muted {
  color: #6b7280;
  font-size: 0.875rem;
}
```

`line-height` without a unit scales with the font size. `clamp(min, preferred, max)` makes a fluid heading without a media query. A font stack falls back from left to right.

## Borders, margin, padding

```css
.card {
  margin: 16px auto;
  padding: 20px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.card > h2 {
  margin: 0 0 8px;
}
```

Margin is space outside the border; padding is space inside. Shorthand `margin: 16px auto` means 16px top and bottom, auto left and right, which centers a fixed-width block. `border-radius` rounds the corners; `box-shadow` adds depth without affecting layout.

## Overflow and z-index

```css
.table-wrap {
  overflow-x: auto;
}

.modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.5);
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 10;
}
```

`overflow-x: auto` adds a horizontal scrollbar only when needed. `z-index` only works on a positioned element or a flex/grid item. A child cannot escape its parent's stacking context, so a high number is not always enough.

## Pseudo-elements and combinators

```css
.card::before {
  content: "";
  display: block;
  height: 4px;
  background: #2563eb;
}

.card > h2 { margin-top: 0; }
.card + .card { margin-top: 16px; }
.card:hover { border-color: #2563eb; }
.card:focus-within { outline: 2px solid #2563eb; }

li:nth-child(odd) { background: #f9fafb; }
input:not([type="checkbox"]) { width: 100%; }
```

`::before` and `::after` create a decorative box; `content` is required. `>` is a direct child, `+` the next sibling, `~` any later sibling. `:nth-child` counts among siblings. `:not()` excludes a case.

## Animation

```css
.fade-in {
  animation: fade-in 0.4s ease-out both;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.button {
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.button:hover {
  background-color: #1d4ed8;
  transform: translateY(-1px);
}

@media (prefers-reduced-motion: reduce) {
  * { animation: none; transition: none; }
}
```

`animation` runs a keyframe sequence; `transition` animates a property change. `both` keeps the final state. Respect `prefers-reduced-motion` for people who get motion sickness.

## Units and functions

```css
.panel {
  width: min(1100px, 100% - 32px);
  min-height: 100vh;
  padding: clamp(16px, 3vw, 32px);
  font-size: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}
```

`rem` is relative to the root font size, `em` to the current element, `vh` and `vw` to the viewport. `min()`, `max()`, and `clamp()` choose a value at runtime. `auto-fill` and `minmax()` make a responsive grid without media queries.

## Quick reminders

- `width: 100%` plus padding overflows unless `border-box` is set.
- A flex child with long text needs `min-width: 0` to shrink.
- `z-index` only works on positioned elements or flex and grid children.
- Test at 320 px wide. That is where layouts break first.
- Prefer `rem` for text and `px` for borders.
- Use `clamp(1rem, 4vw, 2rem)` for fluid type.
