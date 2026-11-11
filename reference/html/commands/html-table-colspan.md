# colspan

HTML command · Tables

Makes a cell cover several columns. The row still has to account for the same total number of column slots as every other row.

## Syntax

```html
<td colspan="2">...</td>
```

## Example

```html
<table>
  <caption>Price per night in EUR, by season</caption>
  <thead>
    <!-- The room header covers both header rows. -->
    <tr>
      <th rowspan="2" scope="col">Room</th>
      <th colspan="3" scope="colgroup">Price per night</th>
    </tr>
    <tr>
      <th scope="col">Spring</th>
      <th scope="col">Summer</th>
      <th scope="col">Winter</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Double</th>
      <td>80</td>
      <td>110</td>
      <td>70</td>
    </tr>
  </tbody>
  <tfoot>
    <!-- One cell, four slots: the label spans every column. -->
    <tr>
      <td colspan="4">Average double room price: 87</td>
    </tr>
  </tfoot>
</table>
```

## Details

Count slots, not cells. A cell with colspan 3 takes three slots in its row. The widest row decides the column count, and a row that adds one slot too many silently creates an extra column for the whole table.

scope="colgroup" on the spanning header tells assistive technology that the header covers the columns below it. Colspan 0 means "to the end of the group" in the specification and is best avoided.
