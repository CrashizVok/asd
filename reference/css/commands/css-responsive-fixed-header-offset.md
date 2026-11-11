# scroll offset under a fixed header

CSS command · Responsive layout

Keeps anchor targets visible below a fixed header instead of scrolling them under it.

## Syntax

```css
html { scroll-padding-top: calc(var(--header-h) + 12px); }
```

## Example

```css
:root {
  --header-h: 56px;
}

html {
  scroll-padding-top: calc(var(--header-h) + 12px);
}

body {
  padding-top: var(--header-h);  /* reserve the header once */
}

@media (min-width: 40em) {
  :root { --header-h: 64px; }    /* padding and offset both follow */
}

/* Section by section alternative: */
#rooms, #rates { scroll-margin-top: calc(var(--header-h) + 12px); }
```
