# disclosure nav with details

CSS command · Responsive layout

A mobile menu that opens without JavaScript and is keyboard accessible by default.

## Syntax

```css
<details><summary>Menu</summary> ... </details>
```

## Example

```css
<details class="nav">
  <summary>Menu</summary>
  <ul>
    <li><a href="#rooms">Rooms</a></li>
    <li><a href="#rates">Rates</a></li>
  </ul>
</details>

<style>
  .nav summary {
    padding: 8px 12px;      /* at least a 44px tap target */
    cursor: pointer;
    list-style: none;       /* hides the default triangle */
  }

  .nav ul {
    position: absolute;     /* overlays the page instead of pushing it */
    right: 16px;
    min-width: 180px;
    background: #fff;
    border: 1px solid #d8dde6;
    border-radius: 10px;
    list-style: none;
    padding: 8px;
  }

  @media (min-width: 40em) {
    .nav summary { display: none; }
    .nav ul { position: static; display: flex; gap: 4px; border: 0; }
  }
</style>
```
