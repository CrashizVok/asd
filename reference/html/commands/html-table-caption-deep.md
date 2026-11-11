# <caption>

HTML command · Tables

Names the table. It must be the first child of table, and screen readers announce it when the table is entered.

## Syntax

```html
<table>
  <caption>Table name</caption>
  ...
</table>
```

## Example

```html
<table>
  <!-- First child: before colgroup, thead, tbody. -->
  <caption>Room prices in EUR, one night, March 2026</caption>

  <thead>
    <tr>
      <th scope="col">Room</th>
      <th scope="col">Price</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Double</th>
      <td>80</td>
    </tr>
  </tbody>
</table>
```

## Details

A heading above the table is not part of the table and is not announced as its name. The caption is.

State unit and period when they are not obvious: prices in EUR, per night, including breakfast. A caption on a layout table is a sign that the table should not exist.
