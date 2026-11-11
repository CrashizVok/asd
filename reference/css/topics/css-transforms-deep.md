# Transforms

CSS topic · Exam Wiki

`transform` moves the painted box of an element without touching layout. The neighbours keep their positions, the scroll height stays the same, and the document flow never notices. That single property is why modern interfaces can lift cards, tilt banners and flip panels without breaking the grid underneath.

The price is that transforms are easy to compose wrongly. Two functions in the wrong order give a different picture, percentages resolve against the element itself rather than its parent, and a `translate` percentage on a rotated box no longer points where the student expects.

## Simplest form

```css
/* Data shape: a list of functions. Each takes numbers with units: px, %, deg, turn. */
.thumb {
  transform: translateX(12px);
}
```

One function, one argument, one unit. Everything else in this topic is that line with more functions in the list.

## What it does

The browser builds a transformation matrix from the function list and applies it at paint time. Layout happened before, using the untransformed box. So a `scale(2)` element still occupies its original space in the flow and simply paints over whatever is next to it.

Three side effects are worth knowing before writing any of it:

1. Any value other than `none` creates a stacking context, so `z-index` inside the element stops interacting with the rest of the page.
2. A transformed element becomes the containing block for `position: fixed` and `position: absolute` descendants. A fixed header inside a transformed parent scrolls with the parent.
3. A transformed element is painted on the compositor when the transform is the only thing changing, which is why animating it is cheap.

Transforms apply to block-level and inline-block boxes. A plain `inline` element such as a bare `<span>` ignores the property entirely, which is a silent bug in about a third of student code.

```css
.badge {
  display: inline-block;   /* required, or transform does nothing */
  transform: rotate(-3deg);
}
```

## Every part

### translate

Moves the box. `translate(x, y)` takes two lengths or percentages, `translateX` and `translateY` take one. A single argument to `translate` means x, with y staying at zero.

```css
.nudge   { transform: translate(8px, 4px); }
.center-x{ transform: translateX(-50%); }
.lift    { transform: translateY(-6px); }
```

Percentages resolve against the element's own border box, not the parent. So `translateX(-50%)` on a tooltip shifts it left by half its own width, which is the standard trick for centring something that was positioned with `left: 50%`.

```css
.tooltip {
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translateX(-50%);   /* pull back by half of its own width */
}
```

That works for any width. `margin-left: -60px` would only work at one fixed width.

The two-argument form is exactly the same as two functions, and `translate3d(x, y, z)` is the 3D version, sometimes written just to force GPU promotion.

### scale

Multiplies size around the origin. `scale(sx, sy)` takes unitless numbers, `scaleX` and `scaleY` take one. A single argument to `scale` means the same factor on both axes.

```css
.shrink { transform: scale(0.96); }
.stretch{ transform: scaleX(1.4); }
.grow   { transform: scale(1.05); }
```

Negative values are legal and mirror the element. `scale(0)` collapses it to nothing, which is how an exiting element is often made to vanish, though `opacity: 0` plus `visibility: hidden` keeps the layout readable.

Scaling does not reflow and does not resample text crisply at every size. Scaling a whole card by 1.05 is safe because the change is small. Scaling a paragraph by 3 to make a zoom effect produces soft text, because the browser stretches the painted result rather than re-laying out the glyphs.

For an image zoom inside a fixed frame, the usual pattern pairs scale with a clipping parent:

```css
.frame {
  overflow: hidden;
}

.frame img {
  transition: transform 400ms ease-out;
}

.frame:hover img {
  transform: scale(1.06);
}
```

### rotate

Turns the box clockwise for positive angles. Units: `deg`, `rad`, `grad`, `turn`. `rotate(1turn)` and `rotate(360deg)` are the same value.

```css
.tilt   { transform: rotate(-2deg); }
.quarter{ transform: rotate(90deg); }
.half   { transform: rotate(0.5turn); }
```

The origin is the centre by default, so a square rotated by 45 degrees looks like a diamond sitting on its corner with equal gaps at all sides.

A chevron is the small case worth memorising. Draw it with borders, rotate 45 degrees, and change the rotation on open state:

```css
.chevron {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(45deg);
  transition: transform 160ms ease;
}

[aria-expanded="true"] .chevron {
  transform: rotate(-135deg);
}
```

Two states, two angles, one transition. No icon font, no second image.

### skew

Shears the box along an axis. `skew(ax, ay)` takes angles, `skewX` and `skewY` take one. Positive `skewX` pushes the top edge to the right relative to the bottom.

```css
.band     { transform: skewY(-4deg); }
.italic-ish{ transform: skewX(-12deg); }
```

Skew is the function most likely to be abandoned, because text inside gets sheared too. The standard repair is to unskew the child:

```css
.band {
  transform: skewY(-4deg);
  background-color: #24518f;
  color: #ffffff;
}

.band > * {
  transform: skewY(4deg);   /* opposite angle, text is upright again */
}
```

The parent's padding and the child's counter-skew together decide whether the result looks deliberate. Values past 10 degrees start to collide with rounded corners and readable text.

### transform-origin

Sets the point the whole function list rotates, scales and skews around. Default `50% 50%`, meaning the centre of the border box, with z at 0.

```css
.origin-center { transform-origin: 50% 50%; }   /* default */
.origin-left   { transform-origin: left center; }
.origin-corner { transform-origin: top left; }
.origin-far    { transform-origin: 120% 50%; }
```

It accepts one, two or three values. One value sets x and leaves y at centre. Two values are x then y, either as keywords or lengths. Percentages resolve against the element's own box, so `100% 100%` is the bottom right corner.

`transform-origin` is applied to the entire list, not to one function. That detail explains a common surprise: with `transform-origin: top left`, a `translate()` still works normally, because translation does not depend on the origin, but a following `rotate()` swings the element around that corner.

```css
/* grows out of the left edge, good for a slide-in panel */
.panel {
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 220ms ease-out;
}

.panel.open {
  transform: scaleX(1);
}
```

### Multiple functions and why order matters

The list is applied left to right, and each function composes with the accumulated matrix. This means `translate` then `rotate` is not the same as `rotate` then `translate`.

```css
/* move 100px right along the page axis, then spin in place */
.a { transform: translateX(100px) rotate(45deg); }

/* spin first, then move along the rotated x axis */
.b { transform: rotate(45deg) translateX(100px); }
```

In `.a` the box ends up 100px to the right of its start. In `.b` the box ends up down and to the right, because the translation happens in the already rotated coordinate system. If you want to move then rotate, put translate first. If you want to orbit, put rotate first.

The practical rule for UI work: `translate` first for position, `rotate` and `scale` after for appearance. The same rule keeps transitions predictable, because a matching function list on both ends interpolates function by function.

### 3D: perspective, translateZ, rotate3d, and preserving depth

3D transforms need a viewer distance, otherwise the projection is flat and `rotateY(45deg)` looks like a horizontal squash.

Two ways to supply it. `perspective` on the parent applies to all children as a shared stage:

```css
.stage {
  perspective: 900px;
}

.card {
  transform: rotateY(25deg);
}
```

Or `perspective()` as the first function in the child's own list, which is a per-element vanishing point:

```css
.card {
  transform: perspective(900px) rotateY(25deg);
}
```

Smaller perspective values exaggerate depth; 600px to 1200px reads naturally for cards. `perspective-origin` moves the vanishing point, defaulting to the centre of the parent.

Nested 3D children flatten unless the parent declares `transform-style: preserve-3d`. Without it, a child's z position is squashed onto the parent's plane, which is why card flips built from two faces sometimes show a blank back.

```css
.flip {
  perspective: 1000px;
}

.flip__inner {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 500ms ease;
}

.flip:hover .flip__inner,
.flip:focus-within .flip__inner {
  transform: rotateY(180deg);
}

.flip__face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;   /* hide the mirrored side */
}

.flip__back {
  transform: rotateY(180deg);
}
```

`backface-visibility: hidden` is what stops the front face from appearing mirrored through the back. Both faces sit in the same box, the back starts pre-rotated by 180 degrees, and the inner wrapper carries the animation.

`translateZ` pushes toward the viewer. Combined with `preserve-3d` it produces depth without a rotate:

```css
.layer--near { transform: translateZ(40px); }
.layer--far  { transform: translateZ(-80px); }
```

`rotate3d(x, y, z, angle)` rotates around an arbitrary axis vector. `rotate3d(1, 1, 0, 45deg)` tilts around the diagonal, useful for a hero image that should feel hand placed rather than mathematically straight.

`matrix(a, b, c, d, e, f)` and `matrix3d(...)` are the raw forms. Read them, do not hand write them: they are what `getComputedStyle` returns and what animation libraries compute.

### transform and layout, one more time

Because layout is unaffected, a transformed element can overlap text, escape its container, or paint outside the viewport. `overflow: hidden` on an ancestor clips it only if the ancestor is in the containing block chain, which a transformed ancestor changes.

Centring a fixed overlay with `translate(-50%, -50%)` is fine. Centring it inside a parent that also has a transform is not, because the overlay is no longer fixed to the viewport.

## Examples

### Example 1: A tooltip that stays centred over any trigger width

```css
.trigger {
  position: relative;
  display: inline-block;
}

.tooltip {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 8px);
  padding: 6px 10px;
  border-radius: 6px;
  background-color: #1f2937;
  color: #ffffff;
  font-size: 0.8rem;
  white-space: nowrap;
  /* hidden state */
  opacity: 0;
  visibility: hidden;
  transform: translate(-50%, 4px);
  transition:
    opacity 140ms ease,
    transform 140ms ease,
    visibility 140ms;
}

.trigger:hover .tooltip,
.trigger:focus-visible .tooltip {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, 0);
}
```

Two transforms, one offset. The `-50%` centres the bubble and the extra `4px` gives it a small rise on entry. `visibility` is transitioned so the hidden bubble cannot be tapped and does not appear in the accessibility tree after fading.

### Example 2: A press that feels physical

```css
.key {
  display: inline-block;
  padding: 12px 20px;
  border: 1px solid #c8d2df;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 2px 0 #c8d2df;
  transform: translateY(0) scale(1);
  transition:
    transform 90ms ease,
    box-shadow 90ms ease;
}

.key:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 0 #c8d2df;
}

.key:active {
  transform: translateY(2px) scale(0.99);
  box-shadow: 0 0 0 #c8d2df;
  transition-duration: 40ms;
}
```

The shadow is not blurred, so the element reads as a physical key. Pressing moves the surface down and removes the shadow at the same time, which is the visual cue for contact.

### Example 3: A clock hand driven by a custom property

```css
.dial {
  position: relative;
  width: 160px;
  height: 160px;
  border: 2px solid #1f2937;
  border-radius: 50%;
}

.hand {
  position: absolute;
  left: 50%;
  bottom: 50%;
  width: 3px;
  height: 64px;
  margin-left: -1.5px;
  background-color: #24518f;
  /* rotate around the bottom of the hand, which sits at the dial centre */
  transform-origin: 50% 100%;
  transform: rotate(var(--angle, 0deg));
  transition: transform 600ms cubic-bezier(0.22, 0.61, 0.36, 1);
}

/* 3 o'clock */
.hand[data-angle="90"]  { --angle: 90deg; }
/* 6 o'clock */
.hand[data-angle="180"] { --angle: 180deg; }
/* 9 o'clock */
.hand[data-angle="270"] { --angle: 270deg; }
```

`transform-origin: 50% 100%` is doing the real work. Without it the hand spins around its own middle and drifts off the dial. The custom property keeps the angle readable and lets script set it later with one line.

### Example 4: A slanted section without sheared text

```css
.band {
  padding: 48px 20px;
  background-color: #24518f;
  color: #ffffff;
  transform: skewY(-3deg);
}

.band__inner {
  max-width: 720px;
  margin: 0 auto;
  /* the exact opposite shear puts the content back upright */
  transform: skewY(3deg);
}
```

The section edges slope, the copy stays level. The heading and paragraphs live inside `.band__inner`, so nothing else needs to know about the skew.

### Example 5: A full page with a 3D flip card and a hover lift

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hotel card flip</title>
  <style>
    :root {
      --ink: #1f2937;
      --muted: #5b6672;
      --brand: #24518f;
      --line: #dbe2ea;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      padding: 40px 20px;
      font-family: system-ui, sans-serif;
      color: var(--ink);
      background-color: #eef2f7;
    }

    .row {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      justify-content: center;
    }

    /* ---------- flip card ---------- */
    .flip {
      /* the viewer distance lives on the parent, shared by both faces */
      width: 260px;
      height: 320px;
      perspective: 1000px;
    }

    .flip__inner {
      position: relative;
      width: 100%;
      height: 100%;
      /* without this the faces flatten onto one plane and the back shows through */
      transform-style: preserve-3d;
      transition: transform 520ms cubic-bezier(0.22, 0.61, 0.36, 1);
    }

    .flip:hover .flip__inner,
    .flip:focus-within .flip__inner {
      transform: rotateY(180deg);
    }

    .flip__face {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 18px;
      border: 1px solid var(--line);
      border-radius: 14px;
      background-color: #ffffff;
      overflow: hidden;
      /* each face is a single sided card */
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;   /* older Safari */
    }

    .flip__face--front {
      background-image: linear-gradient(160deg, #f8fafc, #dbe7f5);
    }

    .flip__face--back {
      /* the back face starts turned around, so it lands upright after the flip */
      transform: rotateY(180deg);
      background-color: var(--brand);
      color: #ffffff;
    }

    .flip__title {
      margin: 0;
      font-size: 1.15rem;
    }

    .flip__meta {
      margin: 4px 0 0;
      font-size: 0.85rem;
      color: var(--muted);
    }

    .flip__face--back .flip__meta {
      color: #cfe0f7;
    }

    /* ---------- list that sits beside the card ---------- */
    .features {
      width: 260px;
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 10px;
      align-content: start;
    }

    .feature {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border: 1px solid var(--line);
      border-radius: 10px;
      background-color: #ffffff;
      /* one list, both directions */
      transition:
        transform 180ms ease-out,
        border-color 180ms ease-out;
    }

    .feature:hover {
      transform: translateX(4px);
      border-color: #b9cadd;
    }

    .feature__dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: var(--brand);
      /* the dot grows in place, origin is its own centre */
      transform: scale(1);
      transition: transform 180ms ease-out;
    }

    .feature:hover .feature__dot {
      transform: scale(1.4);
    }

    /* ---------- reduced motion: no spin, no slide, state still changes ---------- */
    @media (prefers-reduced-motion: reduce) {
      .flip__inner,
      .feature,
      .feature__dot {
        transition-duration: 0.01ms;
      }

      .flip:hover .flip__inner,
      .flip:focus-within .flip__inner {
        transform: none;          /* keep the front face, drop the rotation */
      }

      .feature:hover,
      .feature:hover .feature__dot {
        transform: none;          /* colour and border carry the feedback */
      }
    }
  </style>
</head>
<body>
  <div class="row">
    <div class="flip" tabindex="0">
      <div class="flip__inner">
        <!-- Front: what the guest sees first -->
        <div class="flip__face flip__face--front">
          <p class="flip__meta">Room 204</p>
          <h2 class="flip__title">Double with balcony</h2>
          <p class="flip__meta">2 guests, 24 m2</p>
        </div>
        <!-- Back: details, pre-rotated so it reads upright after the flip -->
        <div class="flip__face flip__face--back">
          <p class="flip__meta">Included</p>
          <h2 class="flip__title">Breakfast and parking</h2>
          <p class="flip__meta">Check-in from 14:00</p>
        </div>
      </div>
    </div>

    <ul class="features">
      <li class="feature"><span class="feature__dot"></span>Free cancellation</li>
      <li class="feature"><span class="feature__dot"></span>Balcony view</li>
      <li class="feature"><span class="feature__dot"></span>Air conditioning</li>
    </ul>
  </div>
</body>
</html>
```

Five moving parts, each with one job. The stage sets perspective. The inner wrapper preserves depth and carries the rotation. The faces are absolutely positioned on top of each other and hide their backs. The feature list uses a plain `translateX` lift, which reveals nothing about layout because layout never moved. The reduced motion block removes every rotation and slide while keeping the colour and border states.

## Common mistakes

Forgetting `display: inline-block` on a `<span>` or `<a>`. The transform is simply ignored on a non-replaced inline box.

Putting `rotate` before `translate` and expecting a straight move. The translation happens along the rotated axis, so the element travels diagonally.

Using `translate(-50%, -50%)` to centre something whose parent has a transform. The child's `position: fixed` is now relative to that parent, not the viewport.

Omitting `transform-style: preserve-3d` on a flip wrapper. The two faces flatten and the back is either hidden or shows through mirrored.

Omitting `backface-visibility: hidden`. The front face is visible from behind, so the flip shows reversed text instead of the back content.

Animating `left` or `top` instead of `translate`. Both work, both force layout on every frame, and the difference is visible on a mid range laptop.

Scaling a large text block. The glyphs are stretched after layout, so they look soft. Scale a small surface or animate `font-size` on a short text instead.

Assuming a transform changes the element's space in the flow. It does not, so a scaled up card can cover its neighbour and a scaled down one leaves a gap.

Leaving a `transform` on a hovered element that also has `will-change: transform` forever. Promotion is per element and cheap, but a page with two hundred promoted layers eats memory for nothing.

Setting `transform-origin` and expecting `translate` to change. Translation is origin independent; only rotate, scale and skew respond to it.

Relying on 3D in an exam where the marker views print output. Provide a readable fallback state, usually the front face.

## Exam checklist

1. Is the target a block or inline-block element?
2. Do percentages in `translate` resolve against the element's own size, as intended?
3. Is the function order translate first, then rotate or scale?
4. Are the function lists identical on both ends of a transition so the browser can interpolate function by function?
5. Is `transform-origin` set wherever a rotate, scale or skew should hinge somewhere other than the centre?
6. For a 3D scene, is there a `perspective` on the parent, `preserve-3d` on the wrapper, and `backface-visibility: hidden` on the faces?
7. Does the transform affect layout in a way the surrounding page notices?
8. Are hover, focus and active states all reachable, with an outline where needed?
9. Does `prefers-reduced-motion` remove rotation and travel while keeping the state change visible?
10. Does the page still read correctly if `transform` is unsupported and every element stays flat?

