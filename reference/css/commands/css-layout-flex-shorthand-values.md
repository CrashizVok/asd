# flex shorthand

CSS command · Flex items

Sets grow, shrink and basis in one line. The one value form is the most common and the most misunderstood.

## Syntax

```css
flex: 1;  flex: auto;  flex: none;  flex: 2 1 200px;
```

## Example

```css
.a { flex: 1; }      /* 1 1 0%   -> equal columns whatever the content */
.b { flex: auto; }   /* 1 1 auto -> content shaped columns */
.c { flex: none; }   /* 0 0 auto -> fixed by content */
.d { flex: 2 1 200px; } /* starts at 200px, takes double share */
```

## Details

`flex: 1` sets the basis to zero, so three items split the container into equal thirds even when one label is much longer. `flex: auto` keeps the content width as the starting point, so the longer label keeps a wider column.

When a column looks wider than its siblings, check whether the shorthand was written as `flex: auto` somewhere.
