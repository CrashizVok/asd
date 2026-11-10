# HTML cheatsheet

Short reference for the exam. Markup is plain: open a tag, close it, keep the nesting tidy.

## Document skeleton

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hotel bookings</title>
  <meta name="description" content="Search and book hotel rooms.">
  <link rel="stylesheet" href="css/components.css">
</head>
<body>
  <h1>Hello</h1>
  <script src="js/app.js" defer></script>
</body>
</html>
```

`<!DOCTYPE html>` switches the browser to standards mode. `lang` helps screen readers pick a voice. `charset` must come first in `head`.

## Semantic tags

Use the tag that describes the content, then style it.

```html
<header>  site header, logo, nav      </header>
<nav>     main navigation links       </nav>
<main>    the one main content block  </main>
<section> a themed group of content   </section>
<article> self-contained item         </article>
<aside>   side notes, related links   </aside>
<footer>  copyright, contact          </footer>
<figure>  image with a caption        </figure>
<figcaption> the caption itself       </figcaption>
<time datetime="2026-11-10">10 Nov</time>
```

Rules of thumb: one `<h1>` per page, one `<main>` per page, headings in order. A `<div>` is fine when nothing else fits; it carries no meaning.

## Links

```html
<a href="https://example.com">External</a>
<a href="about.html">Same folder</a>
<a href="../index.html">One folder up</a>
<a href="#rooms">Jump to section</a>
<a href="mailto:book@example.com">Email us</a>
<a href="tel:+3612345678">Call us</a>
<a href="file.pdf" download>Download</a>
<a href="https://example.com" target="_blank" rel="noopener">New tab</a>
```

Link text should say where it goes. "Click here" tells the reader nothing, and screen readers list links out of context. `rel="noopener"` is required with `target="_blank"` for safety.

## Images

```html
<img src="img/room.jpg" alt="Double room with sea view" width="640" height="420">
<img src="img/icon.svg" alt="" aria-hidden="true">
<figure>
  <img src="img/lobby.jpg" alt="Hotel lobby at night">
  <figcaption>The lobby, open all night.</figcaption>
</figure>
```

`alt` describes the image for someone who cannot see it. Decorative images get `alt=""` so they are skipped. Set `width` and `height` to reserve space and avoid layout shift. Use `<picture>` or `srcset` for different sizes.

## Lists

```html
<ul>
  <li>Free cancel</li>
  <li>Breakfast included</li>
</ul>

<ol>
  <li>Pick a date</li>
  <li>Choose a room</li>
</ol>

<dl>
  <dt>Check-in</dt>
  <dd>From 14:00</dd>
</dl>
```

`ul` for unordered items, `ol` when order matters, `dl` for term and description pairs. Only `li` may sit directly inside `ul` or `ol`.

## Tables

```html
<table>
  <caption>Room prices</caption>
  <thead>
    <tr>
      <th scope="col">Room</th>
      <th scope="col">Price</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Double</th>
      <td>80 EUR</td>
    </tr>
  </tbody>
</table>
```

`caption` names the table. `th` is a header cell, `td` a data cell. `scope` tells assistive tech which cells the header covers. Wrap wide tables in a div with `overflow-x: auto`.

## Forms

```html
<form action="/book" method="post">
  <label for="name">Full name</label>
  <input id="name" name="name" type="text" required minlength="2">

  <label for="email">Email</label>
  <input id="email" name="email" type="email" required>

  <label for="guests">Guests</label>
  <input id="guests" name="guests" type="number" min="1" max="6" value="2">

  <label for="arrive">Arrival</label>
  <input id="arrive" name="arrive" type="date">

  <label for="room">Room type</label>
  <select id="room" name="room">
    <option value="single">Single</option>
    <option value="double" selected>Double</option>
  </select>

  <fieldset>
    <legend>Extras</legend>
    <label><input type="checkbox" name="breakfast"> Breakfast</label>
    <label><input type="radio" name="bed" value="king"> King bed</label>
    <label><input type="radio" name="bed" value="twin"> Twin beds</label>
  </fieldset>

  <label for="notes">Notes</label>
  <textarea id="notes" name="notes" rows="4"></textarea>

  <button type="submit">Book now</button>
</form>
```

Key input types: `text`, `email`, `password`, `number`, `tel`, `url`, `date`, `time`, `search`, `file`, `hidden`, `checkbox`, `radio`, `range`, `color`.

The `name` attribute is what the server receives. No `name`, no value submitted. `id` links the label to the input. `required`, `min`, `max`, `minlength`, `pattern` give free browser validation.

## Labels and buttons

```html
<label for="search">Search</label>
<input id="search" type="search">

<label>
  <input type="checkbox" name="terms" required>
  I accept the terms
</label>

<button type="button" class="btn">Filter</button>
<button type="submit" class="btn">Send</button>
<button type="reset">Clear</button>
```

Always connect a label with `for` plus matching `id`, or by wrapping the input. A label increases the click target and gives the field an accessible name. `type="button"` prevents an accidental form submit inside a form.

## Meta viewport

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

Without it, a phone renders the page at desktop width and zooms out. With it, CSS pixels match the device. Do not add `user-scalable=no`; it blocks pinch zoom and fails accessibility checks.

## Accessibility basics

- Every image has `alt`; decorative images use `alt=""`.
- Every input has a label. Placeholders are not labels.
- Headings run in order: h1, h2, h3. Do not pick a heading for its size.
- Colour contrast of at least 4.5:1 for body text.
- Visible focus outline on links, buttons and inputs.
- Buttons are `<button>`; links that navigate are `<a>`.
- `lang` on `<html>`.
- Use real text instead of text baked into images.
- Give each landmark a name if there are several: `aria-label="Main"`.

## Complete page skeleton

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hotel bookings</title>
  <link rel="stylesheet" href="css/components.css">
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

  <header class="navbar">
    <span class="navbar__brand">StayEasy</span>
    <nav class="navbar__links" aria-label="Main">
      <a href="index.html">Home</a>
      <a href="rooms.html">Rooms</a>
      <a href="contact.html">Contact</a>
    </nav>
  </header>

  <main id="main">
    <section class="hero">
      <div class="panel">
        <h1>Find a room tonight</h1>
        <p>Late checkout included on every booking.</p>
        <a class="btn" href="rooms.html">See rooms</a>
      </div>
    </section>

    <section class="container">
      <h2>Popular rooms</h2>
      <div class="card-grid">
        <article class="card">
          <img class="card__media" src="img/room-1.jpg" alt="Double room with sea view">
          <div class="card__body">
            <h3 class="card__title">Sea view double</h3>
            <p class="card__meta">2 guests, 1 bed</p>
            <p class="card__price">80 EUR / night</p>
          </div>
        </article>
      </div>
    </section>
  </main>

  <footer class="container">
    <p class="muted">StayEasy, Budapest. 2026.</p>
  </footer>

  <script src="js/app.js" defer></script>
</body>
</html>
```

The skip link is the first focusable element, so a keyboard user can jump past the nav. `defer` runs the script after the HTML is parsed, so the DOM exists.
