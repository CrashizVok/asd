# <header> <nav> <main> <aside> <footer>

HTML command · Semantics

The page level landmarks. Each element gives the browser a role and gives screen reader users a jump target.

## Syntax

```html
<header>...</header>
<nav aria-label="Main">...</nav>
<main id="main">...</main>
<footer>...</footer>
```

## Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Bookings</title>
</head>
<body>
  <!-- First tab stop, so keyboard users can skip the menu. -->
  <a href="#main">Skip to content</a>

  <header>Riverside Hotel</header>

  <nav aria-label="Main">
    <a href="/rooms">Rooms</a>
    <a href="/bookings">Bookings</a>
  </nav>

  <!-- tabindex="-1" lets the skip link put focus here. -->
  <main id="main" tabindex="-1">
    <h1>Bookings</h1>
    <p>One upcoming stay.</p>
  </main>

  <footer>12 Dock Street, Budapest</footer>
</body>
</html>
```

## Details

Landmarks in the accessibility tree: **header** becomes banner, **nav** becomes navigation, **main** becomes main, **aside** becomes complementary, **footer** becomes contentinfo. The first and last only keep those roles when they are not nested inside article, aside, main, nav or section.

Rules that carry marks:
- One visible main per page, one h1.
- Every nav beyond the first needs its own label.
- A section needs a heading or a label before it becomes a region.
- Landmarks are siblings; do not put main inside header or nav.
