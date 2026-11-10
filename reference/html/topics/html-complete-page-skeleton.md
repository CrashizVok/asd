# Complete page skeleton

HTML topic · Exam Wiki

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
