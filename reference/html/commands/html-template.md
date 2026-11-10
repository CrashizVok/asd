# <template>

HTML command · Interactive

Holds HTML that is not rendered until JavaScript clones it. Useful for repeated cards or rows.

## Syntax

```html
<template><p>Reusable</p></template>
```

## Example

```html
<template id="card">
  <article class="card"><h2></h2></article>
</template>
<script>
  const copy = card.content.cloneNode(true);
</script>
```
