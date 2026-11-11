# rowspan

HTML command · Tables

Makes a cell cover several rows. The following rows lose one slot each while the span is active.

## Syntax

```html
<th rowspan="2" scope="rowgroup">...</th>
```

## Example

```html
<table>
  <caption>One night, one room of each type, prices in EUR</caption>
  <thead>
    <tr>
      <th scope="col">Hotel</th>
      <th scope="col">Room</th>
      <th scope="col">Price</th>
    </tr>
  </thead>
  <tbody>
    <!-- The hotel header covers both of its rooms. -->
    <tr>
      <th rowspan="2" scope="rowgroup">Riverside</th>
      <td>Double</td>
      <td>80</td>
    </tr>
    <tr>
      <!-- Only two cells here: the first slot belongs to the rowspan above. -->
      <td>Twin</td>
      <td>75</td>
    </tr>
    <tr>
      <th scope="rowgroup">Dock View</th>
      <td>Single</td>
      <td>60</td>
    </tr>
  </tbody>
</table>
```

## Details

A rowspan that reaches past the last row pushes cells into a column that does not exist. Count the slots per row before writing the markup.

Use scope="rowgroup" when the spanning header labels a group of rows. scope="row" is for a header that labels one row only.
