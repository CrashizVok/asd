# headers and id

HTML command · Tables

Explicit header association for irregular tables where scope cannot express which headers apply to a cell.

## Syntax

```html
<th id="h-price">Price</th>
<td headers="h-room h-price">80</td>
```

## Example

```html
<table>
  <caption>Price by room and season, in EUR</caption>
  <thead>
    <tr>
      <th id="h-room" scope="col">Room</th>
      <th id="h-spring" scope="col">Spring</th>
      <th id="h-autumn" scope="col">Autumn</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th id="h-double" scope="row">Double</th>
      <!-- This cell is named by its row header and its column header. -->
      <td headers="h-double h-spring">80</td>
      <td headers="h-double h-autumn">95</td>
    </tr>
  </tbody>
</table>
```

## Details

The headers attribute takes a space separated list of ids. Order does not matter to assistive technology, but column header before row header is the usual reading order.

Long id lists are hard to maintain, and mixing scope with headers carelessly can make a cell announce the same header twice. Reach for this only after scope stops being enough.
