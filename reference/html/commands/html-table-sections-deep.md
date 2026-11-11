# <thead> <tbody> <tfoot>

HTML command · Tables

Row groups. Thead holds header rows, tbody the data, tfoot the summary. Browsers insert tbody around any bare tr.

## Syntax

```html
<table>
  <thead>...</thead>
  <tbody>...</tbody>
  <tfoot>...</tfoot>
</table>
```

## Example

```html
<table>
  <caption>Bookings, March 2026</caption>

  <thead>
    <tr>
      <th scope="col">Guest</th>
      <th scope="col">Nights</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <th scope="row">Booking 1041</th>
      <td>2</td>
    </tr>
  </tbody>

  <!-- Rendered at the bottom, even though it is written last. -->
  <tfoot>
    <tr>
      <th scope="row">Total</th>
      <td>2</td>
    </tr>
  </tfoot>
</table>
```

## Details

The parser inserts tbody, so a CSS selector of table > tr matches nothing in the live DOM. Write tbody tr or table > tbody > tr.

Several tbody elements can group rows, for example one per city. Thead repeats on each printed page in most browsers, which is one reason to use the element rather than styling the first row.
