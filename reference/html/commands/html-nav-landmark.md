# <nav>

HTML command · Semantics

A major block of navigation links. Each nav on a page needs a distinct label so the landmark list stays usable.

## Syntax

```html
<nav aria-label="Main"> ... </nav>
```

## Example

```html
<!-- Two navs, two names: the menu and the breadcrumb trail. -->
<nav aria-label="Main">
  <ul>
    <li><a href="/rooms">Rooms</a></li>
    <li><a href="/bookings" aria-current="page">Bookings</a></li>
  </ul>
</nav>

<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/bookings" aria-current="page">Bookings</a></li>
  </ol>
</nav>
```

## Details

A single link in a paragraph is not navigation. A footer list of social links usually is not either. The main menu, a table of contents, breadcrumbs and pagination are.

Unlabelled duplicates are announced as navigation twice, so the user has to visit both to tell them apart. The newer search element wraps a search form and gives it its own landmark.
