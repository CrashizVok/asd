# <dfn>

HTML command · Semantic text

Marks the term being defined in the surrounding sentence. Linking to its id gives other pages a stable anchor.

## Syntax

```html
<dfn id="adr">average daily rate</dfn>
```

## Example

```html
<!-- the id makes the defined term linkable -->
<p>The <dfn id="adr">average daily rate</dfn> is room revenue divided by rooms sold.</p>
<p>See <a href="#adr">average daily rate</a> above.</p>
```
