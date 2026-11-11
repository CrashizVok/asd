# <footer>

HTML command · Semantics

Closing content for the page or the nearest article: contact details, copyright, related links. Top level it is the contentinfo landmark.

## Syntax

```html
<footer> ... </footer>
```

## Example

```html
<footer>
  <!-- Contact details belong in address, not in a paragraph. -->
  <address>
    Riverside Hotel<br>
    12 Dock Street<br>
    <a href="mailto:front@example.test">front@example.test</a>
  </address>
  <p><small>Prices include VAT.</small></p>
</footer>
```

## Details

A footer inside article, aside, main, nav or section is not contentinfo. An article footer holds tags or the author, which is a valid and common use.

The address element is for contact details of the page or article, not for every postal address in the text.
