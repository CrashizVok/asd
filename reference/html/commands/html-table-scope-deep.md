# scope

HTML command · Tables

Tells assistive technology which cells a header covers. Values are col, row, colgroup and rowgroup.

## Syntax

```html
<th scope="col">...</th>
```

## Example

```html
<table>
  <caption>Bookings for March 2026</caption>
  <thead>
    <tr>
      <!-- Header above a column. -->
      <th scope="col">Guest</th>
      <th scope="col">Room</th>
      <th scope="col">Nights</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <!-- Header at the start of a row. -->
      <th scope="row">Booking 1041</th>
      <td>Double</td>
      <td>2</td>
    </tr>
  </tbody>
</table>
```

## Details

Without scope the browser assumes auto and guesses from position. The guess fails as soon as a colspan or rowspan appears.

scope is enough for nearly every table in the exam. The headers and id attributes are for irregular tables where a cell has more than one header that scope cannot express.
