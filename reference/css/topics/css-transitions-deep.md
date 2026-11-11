# Transitions

CSS topic · Exam Wiki

A transition is a promise between two states of the same element. The cascade still decides the final value. All a transition does is draw the frames on the way there instead of snapping.

That sounds small until it fails. A card refuses to grow, a colour jumps while the shadow glides, the reverse direction happens instantly, and the exam clock is running. Every one of those has a specific cause, and most of them come from the same four properties.

## Simplest form

```css
/* Data shape: property, duration, easing, delay. Four keywords or times, in that order. */
.button {
  background-color: #24518f;
  transition: background-color 180ms ease;
}

.button:hover {
  background-color: #17365f;
}
```

The property names what moves. The time says how long the journey takes. The keyword picks the rhythm. The missing fourth value means there is no wait before it starts.

## What it does

When the computed value of a transitioned property changes, the browser looks at the old value, looks at the new one, and generates intermediate values from the clock. `background-color` at 50 percent of a 180ms transition is half way between the two colours in sRGB space. `width` from `120px` to `200px` passes through `160px` halfway. The page re-renders normally the whole time.

Three conditions must hold, and any one of them missing gives you a silent no-op:

1. The property has to be interpolable, or at least have a defined discrete behaviour. `width`, `color`, `opacity`, `transform` and `filter` are. `display` is not, in the old sense.
2. Both the old and the new computed values have to be concrete. Going from `height: 0` to `height: auto` has no numeric destination, so nothing moves.
3. A transition list must cover that property, and its duration must be greater than zero.

The third one catches people constantly, because `transition-property` defaults to `all` while `transition-duration` defaults to `0s`. A rule that says only `transition: all` therefore does nothing at all.

## Every part

### transition-property

Names the properties to watch. Accepts one property, a comma separated list, the keyword `none`, or the keyword `all`. Its initial value is `all`, which is why a lone duration is enough to animate everything.

```css
.card {
  transition-property: transform, box-shadow;
}

.panel {
  transition-property: none;
}
```

`all` is convenient and slightly dangerous. Change `padding` while debugging, and the layout slides for 300ms. Change `color` on the same element from a parent rule, and it glides too. Professional code lists properties, because the list documents intent.

Shorthand properties are expanded before matching. Asking for `background` also covers `background-color`, since longhands are what actually interpolate.

### transition-duration

How long the interpolation runs, as a time value. Initial value `0s`, which means instant. Negative values are invalid, and a browser drops the whole declaration rather than half of it.

```css
.quick {
  transition-duration: 120ms;
}

.slow-panel {
  transition-duration: 400ms;
}
```

Milliseconds are easier to reason about below one second. Above that, `1.2s` reads better. Anything past roughly 400ms starts to feel like waiting rather than feedback, useful for large panels and annoying for buttons.

Support durations playing a role in perceived performance: a 600ms hover on a nav link makes the page feel heavy even when it is not.

### transition-timing-function

The shape of the speed curve. This is what separates a transition that feels mechanical from one that feels designed.

```css
.linear   { transition-timing-function: linear; }
.ease     { transition-timing-function: ease; }
.ease-in  { transition-timing-function: ease-in; }
.ease-out { transition-timing-function: ease-out; }
.ease-both { transition-timing-function: ease-in-out; }
```

`ease` is the initial value. It starts quickly and settles, which suits small UI changes. `linear` is right for spinners and progress, where a varying speed reads as stutter. `ease-out` decelerates into the destination and is the usual pick for something entering the screen. `ease-in` accelerates away from the start, best for exits.

Two function families go beyond the keywords.

`cubic-bezier(x1, y1, x2, y2)` places two control points on a unit square. The x coordinates must stay between 0 and 1, because time cannot run backwards. The y coordinates may go outside that range, and that is how you get overshoot without keyframes.

```css
.pop {
  transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

That curve passes above 1 and comes back, so the element overshoots its target and settles. It is the cheapest bounce in CSS.

`steps(n, position)` quantises time into `n` jumps. `step-end` equals `steps(1, end)`, `step-start` equals `steps(1, start)`. Steps are how you get a ticking clock hand or a typewriter reveal without JavaScript.

```css
.ticks {
  transition: transform 1s steps(12, end);
}
```

### transition-delay

Time to wait before the interpolation begins. Initial value `0s`. Negative delays are legal and pull the start earlier, so `-100ms` on a `400ms` transition begins a quarter of the way through the curve.

```css
.tooltip {
  transition: opacity 180ms ease 60ms;
}
```

That 60ms is often mistaken for a cheap effect. Its real job is intent. A 60ms delay on a tooltip means a mouse crossing the element on the way somewhere else never triggers a flash.

Positive delay on the way in and zero on the way out is a common pairing, because leaving should feel immediate:

```css
.tooltip {
  opacity: 0;
  transition: opacity 120ms ease;          /* leaving: no wait */
}

.trigger:hover .tooltip {
  opacity: 1;
  transition-delay: 150ms;                /* entering: wait a moment */
}
```

### The shorthand and its list pairing

`transition` takes up to four values per layer, in the order property, duration, timing, delay. The first time value is the duration and the second is the delay. Reversing them is the single most common typo in this topic and produces a transition that waits instead of moving.

```css
.card {
  transition: transform 240ms ease-out 0s, box-shadow 240ms ease-out 0s;
}
```

Several layers are separated by commas. Each longhand receives a list, and the lists are matched by position. If a list is shorter than the property list, it repeats, starting again from its first value.

```css
/* opacity gets 150ms, transform gets 300ms, both get ease */
.fade-slide {
  transition-property: opacity, transform;
  transition-duration: 150ms, 300ms;
  transition-timing-function: ease;
}
```

A declaration for `transition` resets all four longhands. Setting `transition-delay` in a later rule is fine, but setting the `transition` shorthand again wipes any delay you set earlier, because the omitted value goes back to `0s`.

## What can and cannot be interpolated

Numbers interpolate. So do lengths, percentages that resolve to the same basis, colours, angles, shadows of matching structure, filters of matching structure, and `transform` lists that match function by function.

`transform: translateX(10px)` to `transform: translateX(90px)` interpolates as a translation. `rotate(0deg)` to `scale(2)` inside one property does not have matching function lists, so the browser converts both to matrices and interpolates the numbers inside them, which can produce a rotation that shrinks oddly through the middle. Keep the function list identical on both ends and change only the arguments.

`display`, `content`, and other keyword-only properties cannot be smoothly interpolated in the classic model. Modern browsers accept `transition-behavior: allow-discrete` to flip them at the midpoint, but for an exam answer treat `display` as not transitionable and use `visibility` instead.

`visibility` has a special rule worth memorising: it interpolates as visible for the whole duration and only becomes `hidden` at the end. That makes the fade-out-plus-hide pattern work in one line.

```css
.menu {
  opacity: 1;
  visibility: visible;
  transition: opacity 160ms ease, visibility 160ms;
}

.menu.is-hidden {
  opacity: 0;
  visibility: hidden;
}
```

`height: auto` has no numeric end value, so the browser cannot compute frames. The three workable replacements are a fixed height, `max-height` with a guessed upper bound, or a grid row that goes from `0fr` to `1fr`. The grid trick is the only one that adapts to content:

```css
.drawer {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 240ms ease;
}

.drawer.open {
  grid-template-rows: 1fr;
}

.drawer > div {
  overflow: hidden;
}
```

## Where to write the rule

The element in its resting state owns the transition if you want both directions animated. That is the detail students miss: a transition declared inside `:hover` exists only while the pointer is over the element. The moment the pointer leaves, the rule stops matching, the declaration disappears, and the property snaps back.

```css
/* wrong: fades in, snaps out */
.card:hover {
  transform: translateY(-6px);
  transition: transform 200ms ease;
}

/* right: both directions */
.card {
  transition: transform 200ms ease;
}

.card:hover {
  transform: translateY(-6px);
}
```

The reverse is sometimes wanted. Put the transition in the hover block when entering should animate and leaving should be instant, which is the tooltip pattern above.

Transitions also do not fire on first render. There is no previous computed value, so the element appears already transitioned. If a page load animation is required, that is a job for `@keyframes`, not a transition.

## Hover, focus, and touch

`:hover` is a pointer state. It does not exist on a touch screen in any reliable way, and on hybrid laptops it can stick after a tap. Anything that only exists on hover must also be reachable by keyboard, so pair it with `:focus-visible`.

```css
.card:hover,
.card:focus-visible {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgb(15 23 42 / 0.18);
}

.card:focus-visible {
  outline: 3px solid #24518f;
  outline-offset: 3px;
}
```

The outline matters. A card that lifts on focus but shows no ring is a keyboard trap in miniature, because the user cannot tell where they are.

`:active` is the pressed state and should be shorter than hover, usually 80 to 120ms. A press that takes 300ms to register feels broken even though it is animated perfectly.

## Reduced motion

Some people get dizzy from movement. The operating system exposes that as a media query, and a page that ignores it is a page that makes some users nauseous two seconds after opening.

```css
@media (prefers-reduced-motion: reduce) {
  .card,
  .button,
  .menu {
    transition-duration: 0.01ms;
    transition-delay: 0ms;
  }
}
```

A near-zero duration keeps state changes and any `transitionend` listeners working while removing the motion. Killing the transition entirely is also fine and simpler. What you should not do is remove the feedback: keep the colour change, drop the slide.

```css
@media (prefers-reduced-motion: reduce) {
  .card {
    transition: box-shadow 120ms ease;   /* colour stays, movement goes */
  }

  .card:hover {
    transform: none;
  }
}
```

One more detail: this query reports a preference, not a capability. A user can enable it and still want a spinner to spin, so animate opacity for spinners instead of stopping all animation.

## Examples

### Example 1: A button with matched in and out timing

```css
.btn {
  background-color: #24518f;
  color: #ffffff;
  border: 1px solid #1b3f70;
  border-radius: 6px;
  padding: 10px 18px;
  cursor: pointer;
  /* resting rule owns the transition, so leaving animates too */
  transition:
    background-color 140ms ease,
    border-color 140ms ease,
    transform 90ms ease;
}

.btn:hover {
  background-color: #2d61a8;
  border-color: #24518f;
}

.btn:active {
  transform: translateY(1px);
  transition-duration: 60ms;   /* press must feel faster than hover */
}

.btn:focus-visible {
  outline: 3px solid #9ec1ff;
  outline-offset: 2px;
}
```

Three properties, three durations, one rule. Each duration is chosen for what the property does: colour changes are slow enough to notice, the press offset is nearly instant.

### Example 2: A card lift, written twice so the failure is visible

```css
/* Version A: the transition lives in the hover rule.
   Entering animates, leaving snaps. Watch the shadow disappear instantly. */
.card-a:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 28px rgb(15 23 42 / 0.16);
  transition: all 200ms ease;
}

/* Version B: the transition lives on the element.
   Both directions share the same curve, and the browser can interrupt cleanly. */
.card-b {
  background-color: #ffffff;
  border: 1px solid #dbe2ea;
  border-radius: 10px;
  transition:
    transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
    box-shadow 220ms cubic-bezier(0.22, 0.61, 0.36, 1);
}

.card-b:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 28px rgb(15 23 42 / 0.16);
}
```

Version B also avoids `all`. With `all`, a border colour changed by a theme class later would animate without anyone asking for it.

### Example 3: An underline that grows from the left

```css
.nav-link {
  position: relative;
  padding: 8px 2px;
  color: #1f2937;
  text-decoration: none;
}

.nav-link::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background-color: #24518f;
  /* scaleX is cheap: no layout, only compositing */
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 200ms ease-out;
}

.nav-link:hover::after,
.nav-link:focus-visible::after {
  transform: scaleX(1);
}

.nav-link:focus-visible {
  outline: 2px solid #24518f;
  outline-offset: 4px;
}
```

Animating `width` would work and would force layout on every frame. `scaleX` on a pseudo element keeps the work on the compositor, and `transform-origin` decides which end grows.

### Example 4: A staggered list on hover

```css
.menu-item {
  opacity: 0;
  transform: translateY(6px);
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}

/* the delay multiplies per child, so children arrive in sequence */
.menu:hover .menu-item:nth-child(1) { transition-delay: 0ms; }
.menu:hover .menu-item:nth-child(2) { transition-delay: 40ms; }
.menu:hover .menu-item:nth-child(3) { transition-delay: 80ms; }
.menu:hover .menu-item:nth-child(4) { transition-delay: 120ms; }

.menu:hover .menu-item {
  opacity: 1;
  transform: translateY(0);
}
```

Four children means four rules. Past five or six, a custom property set inline by a loop is shorter, but in an exam the hand written version is accepted and easier to debug.

### Example 5: A full page with transitions done properly

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Room types</title>
  <style>
    /* ---------- tokens first, so timing is one decision ---------- */
    :root {
      --ink: #1f2937;
      --muted: #5b6672;
      --line: #dbe2ea;
      --brand: #24518f;
      --brand-dark: #17365f;
      --fast: 120ms;
      --base: 220ms;
      --ease-out: cubic-bezier(0.22, 0.61, 0.36, 1);
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      padding: 32px 20px;
      font-family: system-ui, sans-serif;
      color: var(--ink);
      background-color: #f5f7fa;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      max-width: 900px;
      margin: 0 auto;
    }

    /* ---------- card: one transition list, both directions ---------- */
    .room {
      display: flex;
      flex-direction: column;
      background-color: #ffffff;
      border: 1px solid var(--line);
      border-radius: 12px;
      overflow: hidden;
      /* transform and shadow only; nothing here causes layout */
      transition:
        transform var(--base) var(--ease-out),
        box-shadow var(--base) var(--ease-out),
        border-color var(--base) ease;
    }

    .room:hover,
    .room:focus-within {
      transform: translateY(-6px);
      border-color: #c3d2e4;
      box-shadow: 0 16px 32px rgb(15 23 42 / 0.14);
    }

    /* ---------- image: zoom inside a clipped box ---------- */
    .room__media {
      overflow: hidden;          /* the zoom must not spill */
      aspect-ratio: 4 / 3;
      background-color: #e8eef5;
    }

    .room__media img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transform: scale(1);
      transition: transform 400ms var(--ease-out);
    }

    .room:hover .room__media img,
    .room:focus-within .room__media img {
      transform: scale(1.06);
    }

    .room__body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .room__name {
      margin: 0;
      font-size: 1.1rem;
    }

    .room__price {
      margin: 0;
      color: var(--muted);
      font-size: 0.95rem;
    }

    /* ---------- link: growing underline, keyboard friendly ---------- */
    .room__link {
      position: relative;
      align-self: flex-start;
      margin-top: 4px;
      color: var(--brand);
      font-weight: 600;
      text-decoration: none;
    }

    .room__link::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: -2px;
      height: 2px;
      background-color: currentColor;
      transform: scaleX(0);
      transform-origin: left center;
      transition: transform 180ms var(--ease-out);
    }

    .room__link:hover::after,
    .room__link:focus-visible::after {
      transform: scaleX(1);
    }

    .room__link:focus-visible {
      outline: 3px solid #9ec1ff;
      outline-offset: 3px;
      border-radius: 2px;
    }

    /* ---------- button: fast press, slower colour ---------- */
    .cta {
      margin-top: 10px;
      padding: 10px 16px;
      border: 1px solid var(--brand-dark);
      border-radius: 8px;
      background-color: var(--brand);
      color: #ffffff;
      font: inherit;
      cursor: pointer;
      transition:
        background-color var(--fast) ease,
        transform var(--fast) ease;
    }

    .cta:hover { background-color: var(--brand-dark); }
    .cta:active { transform: translateY(1px); }
    .cta:focus-visible {
      outline: 3px solid #9ec1ff;
      outline-offset: 2px;
    }

    /* ---------- reduced motion: keep state, drop travel ---------- */
    @media (prefers-reduced-motion: reduce) {
      .room,
      .room__media img,
      .room__link::after,
      .cta {
        transition-duration: 0.01ms;
      }

      .room:hover,
      .room:focus-within,
      .cta:active {
        transform: none;           /* no lift, no press offset */
      }

      .room:hover .room__media img,
      .room:focus-within .room__media img {
        transform: none;           /* no zoom */
      }

      .room__link:hover::after,
      .room__link:focus-visible::after {
        transform: scaleX(1);      /* the underline still appears, instantly */
      }
    }
  </style>
</head>
<body>
  <div class="grid">
    <!-- Card one -->
    <article class="room">
      <div class="room__media">
        <img src="room-single.jpg" alt="Single room with a desk and one window">
      </div>
      <div class="room__body">
        <h2 class="room__name">Single</h2>
        <p class="room__price">1 guest, 18 m2</p>
        <a class="room__link" href="#single">Details</a>
        <button class="cta" type="button">Book</button>
      </div>
    </article>

    <!-- Card two -->
    <article class="room">
      <div class="room__media">
        <img src="room-double.jpg" alt="Double room with two beds">
      </div>
      <div class="room__body">
        <h2 class="room__name">Double</h2>
        <p class="room__price">2 guests, 24 m2</p>
        <a class="room__link" href="#double">Details</a>
        <button class="cta" type="button">Book</button>
      </div>
    </article>

    <!-- Card three -->
    <article class="room">
      <div class="room__media">
        <img src="room-family.jpg" alt="Family room with three beds">
      </div>
      <div class="room__body">
        <h2 class="room__name">Family</h2>
        <p class="room__price">4 guests, 32 m2</p>
        <a class="room__link" href="#family">Details</a>
        <button class="cta" type="button">Book</button>
      </div>
    </article>
  </div>
</body>
</html>
```

Read it in four passes: tokens, card, media, controls. The card owns its transition list so leaving looks like entering. The image zoom is clipped by `overflow: hidden`, otherwise the picture would jump over the neighbouring card. The link underline uses `currentColor`, so a colour change in the card does not need a second rule.

## Common mistakes

`transition: all` with no duration. The property defaults to `all` and the duration defaults to `0s`, so this animates nothing while looking like it should.

Writing the transition inside the `:hover` block. Entering animates and leaving snaps, and students often describe this as "the transition only works one way" without seeing the cause.

Animating `height: auto`. There is no destination value to interpolate. The exam version of this bug is an accordion that opens with a jump cut.

Transitioning `display`. It is not interpolable, so the element disappears instantly. Use `visibility` or a grid row instead.

Reversing duration and delay in the shorthand. `transition: opacity 200ms 400ms ease` waits 400ms and then runs in 200ms. More than one student has shipped that.

Forgetting that a shorthand resets longhands. Setting `transition-delay` earlier and then writing `transition: transform 200ms` later clears the delay to `0s`.

Expecting a transition on page load. There is no previous state to leave from.

Transitioning `width` on hover for large elements. Layout on every frame, and the frame budget is small. Use `transform: scaleX` when the geometry allows it.

Trusting hover on touch. A tap can leave the hover state applied until the next tap elsewhere. Always provide a focus or active equivalent.

Ignoring `prefers-reduced-motion`. Cheap to add, and an accessibility point that costs three lines.

Using a long duration on a small control. Anything over 250ms on a button reads as lag, whatever the curve does.

Transitioning an inline element's `transform` and seeing nothing. `transform` does not apply to non-replaced inline boxes. Add `display: inline-block`.

## Exam checklist

1. Did you put the transition on the resting rule, except where a one-way effect is intended?
2. Does every transition have an explicit duration in ms or s?
3. Are properties listed instead of `all` where the task has more than one animated property?
4. Is the first time value the duration and the second the delay?
5. Are both endpoints concrete values, with no `auto`, `display` swap, or missing start state?
6. Does every hover effect have a `:focus-visible` twin and a visible outline?
7. Is the animated property one that avoids layout, `transform` or `opacity` first?
8. Is there a `prefers-reduced-motion` block that removes movement but keeps feedback?
9. Does the page still look correct with no transition support at all, meaning the final states are the same?
10. Did you check the reverse direction by moving the mouse away slowly?

