# Tables

HTML topic · Exam Wiki

```html
<table>
  <caption>Room prices</caption>
  <thead>
    <tr>
      <th scope="col">Room</th>
      <th scope="col">Price</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Double</th>
      <td>80 EUR</td>
    </tr>
  </tbody>
</table>
```

`caption` names the table. `th` is a header cell, `td` a data cell. `scope` tells assistive tech which cells the header covers. Wrap wide tables in a div with `overflow-x: auto`.
