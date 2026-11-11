# <colgroup> and <col>

HTML command · Tables

Groups columns for width and background styling. Col elements are empty and their count should match the real column count.

## Syntax

```html
<colgroup>
  <col class="col-name">
  <col class="col-value">
</colgroup>
```

## Example

```html
<table>
  <caption>Bookings report</caption>

  <!-- Widths live here so the body rows stay clean. -->
  <colgroup>
    <col style="width: 40%">
    <col style="width: 20%">
    <col span="2" style="width: 20%">
  </colgroup>

  <thead>
    <tr>
      <th scope="col">Hotel</th>
      <th scope="col">City</th>
      <th scope="col">Check-in</th>
      <th scope="col">Check-out</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Riverside</th>
      <td>Budapest</td>
      <td>12 Mar</td>
      <td>14 Mar</td>
    </tr>
  </tbody>
</table>
```

## Details

CSS on col supports only a small set of properties: width, background, border and visibility. Text colour and padding on col do nothing.

span on col covers several columns with one element. If the colgroup declares more columns than the table has, browsers pad or ignore the rest and the widths stop lining up.
