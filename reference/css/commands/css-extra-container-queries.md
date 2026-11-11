# @container

CSS command · Layout

Styles children by the size of their container instead of the viewport. The parent must declare container-type first.

## Syntax

```css
@container (min-width: 30rem) { ... }
```

## Example

```css
.card-wrap {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 30rem) {
  /* wide card: image beside the text */
  .card { display: grid; grid-template-columns: 8rem 1fr; }
}
```

## Details

A container query answers the component question: is there room here, inside this column or sidebar. A media query answers the page question. Components reused in several widths need the first one.

container-type: inline-size also creates containment, so the element no longer sizes itself from its content. That is why a card wrapper is a safer container than the card itself.
