# Animations

CSS topic · Exam Wiki

A transition needs a change of state to start. An animation does not. You describe the frames once in `@keyframes`, attach the description to an element, and the browser plays it. That difference decides which tool fits: transitions answer input, animations establish or repeat a look.

An animation also keeps running when nothing interacts, which is both the feature and the hazard. A page with four loops at once is tiring, and a loop that ignores a vestibular disorder is worse. The exam task usually asks for one entrance and one loader, so precision matters more than quantity.

## Simplest form

```css
/* Data shape: name, duration. The name refers to a @keyframes block. */
@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.hero {
  animation: fade-in 400ms ease;
}
```

Two pieces that must agree on the name. Misspell either and nothing happens, with no error in the console.

## What it does

`@keyframes` holds a set of offsets, each with declarations. The offset is a percentage of the animation's timeline, with `from` equal to `0%` and `to` equal to `100%`. The browser samples the timeline, interpolates between the nearest offsets, and paints the result.

Properties not mentioned in any keyframe come from the element's normal style, not from the animation. A keyframe that sets only `opacity` never touches `transform`, so a hover transform on the same element keeps working.

The size of the gap between two offsets changes the speed, because the same value change is spread over more or less time. That is why omitting a `50%` keyframe does not create a pause; it creates one long segment.

`@keyframes` is resolved by name across the whole document. Two blocks with the same name do not merge; the later one wins completely.

```css
@keyframes pulse { from { opacity: 1; } to { opacity: 0.4; } }
@keyframes pulse { from { opacity: 0.9; } to { opacity: 0.5; } }  /* this one is used */
```

Inside a single block, duplicate offsets merge declaration by declaration, with the later declaration winning.

A timeline driven animation can be inspected in devtools, and the per frame state is also readable from script after the fact. Keep that in mind when a keyframe seems ignored: an inline style or a higher specificity rule on the same property is applied before the animation, and the animation only wins during its active or filling interval.

## Every part

### animation-name

The name of a `@keyframes` block, or `none` to disable. Names are case sensitive in the sense that they must match the block, and a custom ident that happens to be a CSS keyword needs quoting in some contexts. Use lower case with hyphens and avoid names like `none`, `initial` and `inherit`.

```css
.spinner {
  animation-name: spin;
  animation-duration: 800ms;
}
```

### animation-duration

The time for one full pass through the keyframes. Initial value `0s`, so a name without a duration does nothing. Negative values are invalid. Each of the comma separated animations can have its own.

```css
.spinner { animation-duration: 800ms; }
.shake   { animation-duration: 320ms; }
```

### animation-timing-function

The easing applied between keyframes, not across the whole animation. This is the detail that trips people up: with three keyframes and `ease-in-out`, each segment eases in and out on its own, so the animation slows at every offset. With `linear`, the speed is constant unless the keyframes change it.

```css
.tick {
  animation: tick 1s steps(12, end) infinite;
}

.breathe {
  animation: breathe 4s ease-in-out infinite;
}
```

A single timing function can be overridden per segment by declaring `animation-timing-function` inside a keyframe, which applies from that offset onward:

```css
@keyframes drop {
  0%   { transform: translateY(-40px); animation-timing-function: ease-in; }
  70%  { transform: translateY(0);     animation-timing-function: ease-out; }
  100% { transform: translateY(0); }
}
```

The fall accelerates, the landing decelerates. One keyframe block, two different feels.

### animation-delay

Time before the first pass starts. Positive waits, negative starts partway in. `-400ms` on a `1s` animation begins at the 40 percent mark, useful for desynchronising several copies of the same loop.

```css
.wave:nth-child(1) { animation-delay: 0ms; }
.wave:nth-child(2) { animation-delay: 120ms; }
.wave:nth-child(3) { animation-delay: 240ms; }
```

### animation-iteration-count

How many passes run. A number, or `infinite`. Fractional values are legal, so `2.5` stops halfway through the third pass.

```css
.blink { animation: blink 900ms steps(1, end) infinite; }
.once  { animation: fade-in 400ms ease 1; }
```

`infinite` animations never end, so they never fire `animationend`. Any cleanup logic attached to that event must not rely on it for looping elements.

### animation-direction

Which way the timeline is read, per iteration.

```css
.forward  { animation-direction: normal; }
.backward { animation-direction: reverse; }
.ping-pong{ animation-direction: alternate; }
.back-pong{ animation-direction: alternate-reverse; }
```

`alternate` reverses every second pass, so a two second animation with `infinite` breathes in and out without duplicating the keyframes in reverse. It also changes the effective duration of a loop: `iteration-count: 2` with `alternate` is one full cycle out and back, not two cycles out.

`reverse` is handy for a spinner that should turn counter clockwise, and for reusing one keyframe block for a mirror effect without writing a second one.

### animation-fill-mode

What happens outside the active interval, meaning before the delay and after the end.

```css
.none      { animation-fill-mode: none; }       /* element returns to its own style */
.forwards  { animation-fill-mode: forwards; }   /* keep the last keyframe */
.backwards { animation-fill-mode: backwards; }  /* apply the first keyframe during the delay */
.both      { animation-fill-mode: both; }
```

The default `none` is the reason a slide-in jumps back to its starting position when it finishes. The element was at `translateX(-20px)` only because the animation was running. Once it ends, the normal style applies again.

`forwards` fixes that. `backwards` fixes a different problem: with a delay and `fill-mode: none`, the element sits in its natural state during the wait and jumps at the start. `backwards` holds the first keyframe during the delay so the entrance is clean. `both` does both jobs and is the right default for entrance animations.

```css
.enter {
  animation: slide-up 450ms ease-out 120ms both;
}
```

That one line covers the wait, the movement, and the final state.

### animation-play-state

`running` or `paused`. Pausing keeps the computed state, so the element freezes where it is instead of resetting.

```css
.ticker {
  animation: slide 18s linear infinite;
}

.ticker:hover,
.ticker:focus-within {
  animation-play-state: paused;   /* reading something long? hold it still */
}
```

Pausing on hover is the accessible way to handle a moving news strip: it does not stop the animation for everyone, and keyboard users get the same courtesy through `:focus-within`.

### The shorthand and lists

`animation` accepts name, duration, timing, delay, iteration-count, direction, fill-mode, play-state, and the timeline. Only the name is required. The first time value is duration, the second is delay, so the same reversal trap as `transition` exists here.

```css
.loader {
  animation: spin 900ms linear infinite;
}

.enter {
  animation: slide-up 450ms ease-out 120ms 1 normal both running;
}
```

Comma separates independent animations, and the longhand lists pair by position with the repeating rule:

```css
.status {
  animation-name: fade-in, pulse;
  animation-duration: 300ms, 2s;
  animation-timing-function: ease-out, ease-in-out;
  animation-iteration-count: 1, infinite;
  animation-fill-mode: both, none;
}
```

Two animations on one element must not fight over the same property. If both animate `transform`, the later one in the list wins for the overlapping span, and the result looks like one of them was ignored. Split the jobs: one animation on `transform`, the other on `box-shadow` or `opacity`.

## What is cheap to animate

`transform` and `opacity` are handled on the compositor and skip layout and paint. `background-color`, `box-shadow`, `filter`, `clip-path` and `border-radius` cause paint work. `width`, `height`, `top`, `left`, `margin` and `font-size` cause layout, which is the expensive one.

A spinner built from `rotate` costs almost nothing. A spinner built from `left: 0` to `left: 40px` on a 200 item list costs a lot. Neither is wrong in an exam, but the first is the answer that shows understanding.

`will-change: transform` hints for promotion. Use it on the one element that is about to move, not on every card, and remove it when the animation is over. Permanent promotion of many elements uses memory that a phone does not have.

## Reduced motion

An infinite loop is more intrusive than a transition. The preference check belongs on every animation that moves something, and the safe substitute is usually opacity or a colour change.

```css
@media (prefers-reduced-motion: reduce) {
  .enter,
  .float,
  .ticker {
    animation: none;
  }

  /* a loader must still look busy, so fade instead of spin */
  .loader {
    animation: pulse-opacity 1.6s ease-in-out infinite;
  }

  @keyframes pulse-opacity {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0.55; }
  }
}
```

`animation: none` also cancels the fill mode, so an entrance animation that ended at its final state leaves the element at its normal style. If the final state was only defined in a keyframe, define it on the element too. That is the one bug this pattern introduces, and it appears exactly when the keyframe did the work of a normal declaration.

## Watching an animation from script

Three events fire on the element: `animationstart`, `animationiteration` and `animationend`. They bubble, and `event.animationName` tells you which one finished when several are running.

```js
const banner = document.querySelector('.banner');

banner.addEventListener('animationend', (event) => {
  if (event.animationName !== 'slide-up') return;
  banner.classList.add('is-settled');   // hand over to a static style
  banner.style.animation = 'none';      // drop the animation, keep the class
});
```

The order matters. Add the static class first, then clear the animation, otherwise the element flashes back for a frame. This pattern exists so a finished entrance does not keep a composited layer alive for the rest of the session.

## Examples

### Example 1: A spinner in four lines

```css
@keyframes spin {
  to { transform: rotate(1turn); }
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #dbe2ea;
  border-top-color: #24518f;
  border-radius: 50%;
  animation: spin 800ms linear infinite;
}
```

The single keyframe sets only `to`. The browser takes `from` from the element's computed style, which is `rotate(0)`. `linear` is required here: any easing makes a spinner visibly stutter once per turn.

### Example 2: A skeleton shimmer that does not repaint the layout

```css
@keyframes shimmer {
  from { background-position: -160% 0; }
  to   { background-position: 260% 0; }
}

.skeleton {
  height: 14px;
  border-radius: 7px;
  background-image: linear-gradient(
    90deg,
    #e6ebf1 0%,
    #f4f7fa 45%,
    #e6ebf1 90%
  );
  background-size: 200% 100%;
  background-repeat: no-repeat;
  animation: shimmer 1.4s linear infinite;
}

.skeleton--wide { width: 100%; }
.skeleton--short { width: 60%; }
```

`background-position` repaints but does not lay out, which is acceptable for a few placeholder bars. The alternative, a moving pseudo element with `transform: translateX`, avoids the repaint but needs an extra node and `overflow: hidden`. For an exam, the gradient version is shorter and easier to defend.

### Example 3: An entrance with fill mode and a stagger

```css
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  /* both keeps the first frame during the delay and the last frame after the end */
  animation: slide-up 420ms cubic-bezier(0.22, 0.61, 0.36, 1) both;
}

.card:nth-child(1) { animation-delay: 0ms; }
.card:nth-child(2) { animation-delay: 70ms; }
.card:nth-child(3) { animation-delay: 140ms; }
.card:nth-child(4) { animation-delay: 210ms; }

@media (prefers-reduced-motion: reduce) {
  .card {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

Without `both`, each card would flash at full opacity while waiting for its delay. Without the reduced motion block, four cards slide up on a page opened by someone who asked the system not to do that.

### Example 4: An attention shake for a rejected form field

```css
@keyframes nudge {
  0%, 100% { transform: translateX(0); }
  20%      { transform: translateX(-5px); }
  40%      { transform: translateX(5px); }
  60%      { transform: translateX(-3px); }
  80%      { transform: translateX(3px); }
}

.field.is-invalid {
  animation: nudge 320ms ease-in-out 1;
  border-color: #b42318;
}
```

One pass, no fill mode, no loop. The border colour carries the message permanently, so the shake is decoration rather than information. A shake is never the only error signal.

### Example 5: A full page with an entrance, a loader, and a paused ticker

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Booking summary</title>
  <style>
    :root {
      --ink: #1f2937;
      --muted: #5b6672;
      --brand: #24518f;
      --line: #dbe2ea;
      --ease-out: cubic-bezier(0.22, 0.61, 0.36, 1);
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      padding: 28px 20px;
      font-family: system-ui, sans-serif;
      color: var(--ink);
      background-color: #f5f7fa;
    }

    .panel {
      max-width: 560px;
      margin: 0 auto;
      padding: 24px;
      border: 1px solid var(--line);
      border-radius: 14px;
      background-color: #ffffff;
    }

    /* ---------- entrance: one animation for the whole panel ---------- */
    @keyframes panel-in {
      from {
        opacity: 0;
        transform: translateY(18px) scale(0.99);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .panel {
      /* both = hold the first frame during the 80ms delay, keep the last frame at the end */
      animation: panel-in 460ms var(--ease-out) 80ms both;
    }

    /* ---------- rows: staggered so the eye reads top to bottom ---------- */
    @keyframes row-in {
      from {
        opacity: 0;
        transform: translateX(-10px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid #eef2f7;
      animation: row-in 360ms var(--ease-out) both;
    }

    /* delays continue after the panel has started, so the rows follow it in */
    .row:nth-child(2) { animation-delay: 220ms; }
    .row:nth-child(3) { animation-delay: 290ms; }
    .row:nth-child(4) { animation-delay: 360ms; }
    .row:nth-child(5) { animation-delay: 430ms; }

    .row__label { color: var(--muted); }
    .row__value { font-weight: 600; }

    /* ---------- loader: linear, infinite, small ---------- */
    @keyframes spin {
      to { transform: rotate(1turn); }
    }

    .loader {
      width: 22px;
      height: 22px;
      border: 3px solid var(--line);
      border-top-color: var(--brand);
      border-radius: 50%;
      animation: spin 800ms linear infinite;
    }

    .status {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 18px;
      color: var(--muted);
      font-size: 0.9rem;
    }

    /* ---------- ticker: loops until someone looks at it ---------- */
    @keyframes ticker {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }

    .ticker {
      margin-top: 22px;
      overflow: hidden;
      border-top: 1px solid var(--line);
      padding-top: 12px;
    }

    .ticker__track {
      display: flex;
      gap: 40px;
      width: max-content;
      white-space: nowrap;
      color: var(--muted);
      font-size: 0.85rem;
      /* the content is duplicated, so a 50 percent shift lands on an identical frame */
      animation: ticker 16s linear infinite;
    }

    .ticker:hover .ticker__track,
    .ticker:focus-within .ticker__track {
      animation-play-state: paused;
    }

    /* ---------- reduced motion: no travel, no loop, feedback survives ---------- */
    @keyframes fade-only {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    @media (prefers-reduced-motion: reduce) {
      .panel,
      .row {
        animation-name: fade-only;      /* keep the fade, drop the movement */
        animation-duration: 200ms;
      }

      .ticker__track {
        animation: none;                /* static strip, still readable */
      }

      .loader {
        animation: none;
        border-top-color: var(--line);  /* plain ring instead of a spin */
        border-color: var(--brand);
        opacity: 0.7;
      }
    }
  </style>
</head>
<body>
  <section class="panel">
    <h1>Booking summary</h1>

    <div class="row">
      <span class="row__label">Guest</span>
      <span class="row__value">A. Kovacs</span>
    </div>
    <div class="row">
      <span class="row__label">Room</span>
      <span class="row__value">Double, 2 nights</span>
    </div>
    <div class="row">
      <span class="row__label">Arrival</span>
      <span class="row__value">2026-05-14</span>
    </div>
    <div class="row">
      <span class="row__label">Total</span>
      <span class="row__value">184 EUR</span>
    </div>

    <p class="status">
      <span class="loader" aria-hidden="true"></span>
      Confirming availability
    </p>

    <div class="ticker" tabindex="0" aria-label="Recent bookings">
      <div class="ticker__track">
        <span>Room 101 booked</span>
        <span>Room 204 booked</span>
        <span>Room 305 booked</span>
        <span>Room 101 booked</span>
        <span>Room 204 booked</span>
        <span>Room 305 booked</span>
      </div>
    </div>
  </section>
</body>
</html>
```

Four animations, each with a different job and a different duration scale: 460ms for the panel, 360ms with staggered delays for the rows, 800ms for the loader, 16s for the ticker. The ticker content is duplicated so the `-50%` shift ends on a frame identical to the start, and the loop has no visible jump.

The reduced motion block keeps the fade, because a fade carries no motion, and stops the ticker, because a strip that never stops moving is the exact thing the preference exists for.

## Common mistakes

A name that does not match a `@keyframes` block. No error, no animation. Check spelling first when nothing happens.

A name without a duration. The initial duration is `0s`, so the animation completes in zero time.

Forgetting `animation-fill-mode: forwards` or `both` on an entrance, then watching the element snap back to its pre-animation position when the animation ends.

Expecting `iteration-count: 2` with `direction: alternate` to show the loop twice. It shows one out and back, because one iteration is one pass through the timeline.

Assuming `animation-timing-function` applies once across the whole animation. It applies to each keyframe segment.

Putting two animations with `transform` on the same element. One silently overrides the other for the overlapping time.

Animating `left`, `top` or `width` in a loop. Layout on every frame, and the jank is visible on any modest machine.

Building a looping loader with `will-change: transform` left on twenty elements. Promotion memory is not free.

Using `animationend` to clean up an infinite animation. It never fires.

Relying on `animation: none` in a reduced motion block when the final state existed only in the keyframes. The element falls back to its base style and can disappear.

Letting a marquee or ticker run with no pause control. Add `:hover` and `:focus-within` pause, and stop it entirely under reduced motion.

Giving a small button a 700ms animation. Feedback should land under a third of a second.

## Exam checklist

1. Does every `animation-name` have a matching `@keyframes` block, spelled identically?
2. Does every animation have an explicit duration?
3. Is the first time value the duration and the second the delay?
4. Is `fill-mode` set to `both` or `forwards` wherever the end state must persist?
5. For looped or `alternate` animations, is the iteration count and direction combination what the visual actually needs?
6. Are entrance animations staggered with delays rather than long durations?
7. Is there a pause path for anything that moves for more than a few seconds?
8. Is there a `prefers-reduced-motion` block that removes movement but keeps the state visible?
9. Are the animated properties `transform` and `opacity` where possible?
10. Do two animations on the same element touch different properties?
11. If script listens for `animationend`, is the enter animation non looping and is the final state also declared outside the keyframes?
12. Does the page look correct with animations disabled entirely?

