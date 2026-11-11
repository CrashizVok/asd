---
id: html-tables-deep
lang: HTML
title: HTML tables
---

# HTML tables

A table is for data that has two axes: rows of records and columns of fields. The browser exposes that structure to assistive technology, so a screen reader can announce "Price, Double room, 80" instead of reading a flat stream of numbers. Once the structure is right, CSS handles borders, spacing and width.

Exam tables usually come as a report: a caption, a header row, grouped rows, a total. Get the cell arithmetic right and the accessibility attributes follow a simple pattern.

## Simplest form

```html
<!-- Data shape: records with the same fields, one header row, one cell per field -->
<table>
  <tr>
    <th scope="col">Hotel</th>
    <th scope="col">Stars</th>
  </tr>
  <tr>
    <td>Riverside</td>
    <td>4</td>
  </tr>
  <tr>
    <td>Dock View</td>
    <td>3</td>
  </tr>
</table>
```

No `thead`, no `tbody`, no `caption`. Browsers insert a `tbody` for you and the table is valid. Every later section adds structure you actually need.

## The parts, in source order

### table

`table` is the container. It is not a layout tool. A page built from nested tables for columns and spacing is the classic 2003 mistake: the reading order becomes the cell grid, resizing breaks, and a screen reader announces "table with 12 rows" for what is really a menu.

If you inherit a layout table and cannot remove it, add `role="presentation"` so the structure is dropped from the accessibility tree, and strip borders in CSS. That is a repair, not a design.

### caption

`caption` names the table. It must be the first child of `table`, before `colgroup` and `thead`. Browsers render it above the table, centred by default, and screen readers announce it when the table is entered. That announcement is why the caption matters more than a heading placed above the table: the heading is not part of the table.

```html
<table>
  <caption>Room prices, one night, breakfast included</caption>
  ...
</table>
```

The caption should say what the table contains and, when needed, the unit and the period. "Prices" is weak. "Room prices in EUR, one night, March 2026" is useful. Do not put a caption on a layout table.

### colgroup and col

`colgroup` groups columns so you can style or describe them as a unit. `col` is an empty element that stands for one column. Both are optional and mostly used for widths and background bands, because CSS on `col` only supports a small set of properties: `width`, `background`, `border`, `visibility`.

```html
<table>
  <caption>Room prices</caption>
  <colgroup>
    <col class="col-room">
    <col class="col-price">
  </colgroup>
  ...
</table>
```

The number of `col` elements should match the number of columns. The `span` attribute on a `col` lets one `col` cover several columns. If the counts disagree, browsers pad or ignore the extra, and you get widths that do not line up.

### thead, tbody, tfoot

These are row groups. `thead` holds the header rows, `tbody` holds the data rows, `tfoot` holds summary rows.

The browser inserts `tbody` around any `tr` that is a direct child of `table`. That insertion is why a CSS selector like `table > tr` selects nothing in the live DOM even though the source looks like it should. Write `table > tbody > tr` or `tbody tr`.

A table may have several `tbody` elements to group rows, for example one group per city. Each `tbody` can carry its own heading row if the design needs it.

`tfoot` is optional. When it exists, CSS renders it at the bottom even if the source puts it before `tbody`. Most code writes it last anyway, because a human reading the source should reach the total after the rows. On print, `thead` repeats at the top of each page in most browsers, which is a good reason to use the element rather than styling the first row.

### tr

`tr` is a row and may contain only `td` and `th`. Text directly inside `tr` is invalid and gets moved out by the parser.

### th

`th` is a header cell. It can be a column header or a row header, and `scope` says which one. It is also bold and centred by default, which is styling, not meaning.

Attributes that matter:

- `scope="col"` for a header above a column.
- `scope="row"` for a header at the start of a row.
- `scope="colgroup"` for a header that spans several columns.
- `scope="rowgroup"` for a header that spans several rows.
- `colspan` and `rowspan` work exactly as they do on `td`.
- `abbr` gives a short form for screen readers when the visible header is long.
- `aria-sort="ascending"` or `"descending"` marks the sorted column. It belongs on the header whose column is sorted, and the page must update it when the sort changes.

### td

`td` is a data cell. `colspan` and `rowspan` merge it with neighbours. A cell can also use `headers` instead of relying on `scope`.

### scope versus headers and id

`scope` is enough for almost every table you will write in the exam. It is short, it is read by every screen reader, and it needs no ids.

The `headers` attribute is for irregular tables where spans make the header ambiguous. Each header cell gets an `id`, and a data cell lists the ids of every header that applies:

```html
<table>
  <caption>Price by season</caption>
  <tr>
    <th id="h-room" scope="col">Room</th>
    <th id="h-spring" scope="col">Spring</th>
  </tr>
  <tr>
    <th id="h-double" scope="row">Double</th>
    <td headers="h-double h-spring">80</td>
  </tr>
</table>
```

Long id lists are hard to maintain. Use them when `scope` cannot express the relationship, not as a default. Mixing both without care can make a cell read two headers twice.

## Table geometry

Every row must describe the same number of columns. Count the slots, not the cells:

- A cell with no `colspan` takes one slot.
- A cell with `colspan="3"` takes three slots in that row.
- A cell with `rowspan="2"` takes a slot in its own row and holds a slot in each of the next rows.

A worked grid:

```html
<!-- Column count is 3. Row 1 starts a rowspan that covers row 2 as well. -->
<tr>
  <th rowspan="2" scope="rowgroup">Riverside</th>
  <td>Double</td>
  <td>80</td>
</tr>
<tr>
  <td>Twin</td>
  <td>75</td>
</tr>
```

Row 1: one slot for the hotel header, one for the room, one for the price. Three. Row 2: the hotel slot is already held by the rowspan, then two cells. Three. If row 2 had three `td` elements, the table would grow a fourth column and the last cell would sit outside the header structure.

Browsers are forgiving. A row with too few cells simply leaves empty space at the end of that row. A row with too many creates an extra column for the whole table. Both produce a table that looks almost right and reads wrong, which is harder to spot than an error.

`colspan="0"` and `rowspan="0"` mean "span to the end of the group" in the specification. They are rarely used and badly supported by assistive technology, so avoid them.

## Accessibility

A table is usable with a screen reader when four things are true: the table has a caption, every header is a `th` with a scope, the geometry is consistent, and the sorted column is announced.

Smaller points that come up in review:

- Numbers align right with CSS. `align="right"` on a cell is obsolete.
- An empty cell should contain a dash or a short word such as "none", because a blank cell can be skipped silently. `empty-cells: show` keeps the border visible.
- A table that scrolls horizontally needs a keyboard path. Wrap it in a `div` with `overflow-x: auto`, `tabindex="0"`, `role="region"` and a label, so a keyboard user can focus the region and scroll with the arrow keys.
- `position: sticky` on `thead th` keeps the header visible in a long table. It needs a background colour, or rows show through. With two header rows each row needs its own `top` offset, or they stack at the same place.
- Print repeats `thead` on each page in current browsers. `tfoot` repetition is not reliable, so do not put essential notes only in the footer row.
- Sorting by clicking a header must update `aria-sort` and keep the header text unchanged. A sortable header is usually a `button` inside the `th`, not a click handler on the `th` itself.
- Never put a form, a video, or a full article inside a cell. If the content is not tabular data, it does not belong in a table.
- Nested tables are legal and almost always a sign that the outer table is being used for layout.

## Examples

### Example 1: three columns with a caption and a footer

```html
<table>
  <!-- First child, so screen readers announce it with the table. -->
  <caption>Bookings for March 2026</caption>

  <thead>
    <tr>
      <th scope="col">Guest</th>
      <th scope="col">Room</th>
      <th scope="col">Nights</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <th scope="row">Booking 1041</th>
      <td>Double</td>
      <td>2</td>
    </tr>
    <tr>
      <th scope="row">Booking 1042</th>
      <td>Twin</td>
      <td>5</td>
    </tr>
  </tbody>

  <!-- Renders at the bottom. Source order is a choice; CSS fixes the visual order. -->
  <tfoot>
    <tr>
      <td colspan="2">Total nights</td>
      <td>7</td>
    </tr>
  </tfoot>
</table>
```

The booking number is a row header, not data, because every other cell in the row is described by it. The footer cell spans the first two columns, so the 7 lands under "Nights".

### Example 2: rowspan and colspan in the same table

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
      <td>Twin</td>
      <td>75</td>
    </tr>

    <tr>
      <th scope="rowgroup">Dock View</th>
      <td>Single</td>
      <td>60</td>
    </tr>
  </tbody>

  <tfoot>
    <tr>
      <!-- Two columns merged for the label, the value stays under Price. -->
      <td colspan="2">Total for all three rooms</td>
      <td>215</td>
    </tr>
  </tfoot>
</table>
```

Three slots per row. The second row has only two `td` elements because the first slot belongs to the hotel cell above it. The footer has two cells, one of them two columns wide, so it still covers three slots.

### Example 3: a two level header

```html
<table>
  <caption>Price per night in EUR, by season</caption>

  <thead>
    <!-- Row 1: the room label covers both header rows, the price group covers four columns. -->
    <tr>
      <th rowspan="2" scope="col">Room</th>
      <th colspan="4" scope="colgroup">Price per night</th>
    </tr>

    <!-- Row 2: four sub headers, each one column. -->
    <tr>
      <th scope="col">Spring</th>
      <th scope="col">Summer</th>
      <th scope="col">Autumn</th>
      <th scope="col">Winter</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <th scope="row">Double</th>
      <td>80</td>
      <td>110</td>
      <td>95</td>
      <td>70</td>
    </tr>
    <tr>
      <th scope="row">Twin</th>
      <td>75</td>
      <td>105</td>
      <td>90</td>
      <td>65</td>
    </tr>
    <tr>
      <th scope="row">Suite</th>
      <td>140</td>
      <td>180</td>
      <td>160</td>
      <td>120</td>
    </tr>
  </tbody>
</table>
```

Five columns. Row 1 spends one slot on the room header, which also covers row 2, and four on the price group. Row 2 has the room slot already held, then four sub headers. `scope="colgroup"` on the spanning header tells the screen reader that the group covers the four columns below it.

### Example 4: a full bookings report

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Bookings report</title>

  <style>
    /* The wrapper scrolls on narrow screens and takes focus from the keyboard. */
    .table-wrap {
      overflow-x: auto;
      border: 1px solid #d5d9e0;
    }
    .table-wrap:focus-visible {
      outline: 2px solid #1a4f8b;
      outline-offset: 2px;
    }

    table {
      width: 100%;
      min-width: 40rem;
      border-collapse: collapse;
      font: 0.95rem/1.4 system-ui, sans-serif;
    }

    caption {
      padding: 0.5rem;
      text-align: left;
      font-weight: 600;
      caption-side: top;
    }

    th,
    td {
      padding: 0.5rem 0.65rem;
      border-bottom: 1px solid #e2e5ea;
      text-align: left;
      vertical-align: top;
    }

    /* Money and counts read better right aligned. */
    .num {
      text-align: right;
      font-variant-numeric: tabular-nums;
    }

    tfoot td {
      font-weight: 600;
      background: #f7f8fa;
    }
  </style>
</head>
<body>
  <h1>Bookings report</h1>

  <!-- tabindex and the region role let a keyboard user scroll the table. -->
  <div class="table-wrap" tabindex="0" role="region"
       aria-label="Bookings report, scrollable table">
    <table>
      <!-- Caption is the first child of table. -->
      <caption>Bookings from March to May 2026, prices in EUR</caption>

      <!-- Column widths live in colgroup so the body stays clean. -->
      <colgroup>
        <col style="width: 26%">
        <col style="width: 14%">
        <col style="width: 14%">
        <col style="width: 14%">
        <col style="width: 12%">
        <col style="width: 20%">
      </colgroup>

      <thead>
        <!-- Row 1 covers all six columns: four single slots, one pair, one single. -->
        <tr>
          <th rowspan="2" scope="col" aria-sort="ascending">Hotel</th>
          <th rowspan="2" scope="col">City</th>
          <th colspan="2" scope="colgroup">Stay</th>
          <th rowspan="2" scope="col">Guests</th>
          <th rowspan="2" scope="col">Total</th>
        </tr>
        <!-- Row 2 supplies the two sub headers under "Stay". -->
        <tr>
          <th scope="col">Check-in</th>
          <th scope="col">Check-out</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <th scope="row">Riverside</th>
          <td>Budapest</td>
          <td><time datetime="2026-03-12">12 Mar 2026</time></td>
          <td><time datetime="2026-03-14">14 Mar 2026</time></td>
          <td class="num">2</td>
          <td class="num">320</td>
        </tr>
        <tr>
          <th scope="row">Riverside</th>
          <td>Budapest</td>
          <td><time datetime="2026-04-02">2 Apr 2026</time></td>
          <td><time datetime="2026-04-05">5 Apr 2026</time></td>
          <td class="num">3</td>
          <td class="num">480</td>
        </tr>
        <tr>
          <th scope="row">Dock View</th>
          <td>Vienna</td>
          <td><time datetime="2026-05-10">10 May 2026</time></td>
          <td><time datetime="2026-05-11">11 May 2026</time></td>
          <td class="num">1</td>
          <td class="num">240</td>
        </tr>
      </tbody>

      <tfoot>
        <!-- Five slots for the label, one for the total. -->
        <tr>
          <td colspan="5">Total for 3 bookings</td>
          <td class="num">1 040</td>
        </tr>
      </tfoot>
    </table>
  </div>

  <p><small>Sample data. The prices are not real.</small></p>
</body>
</html>
```

The header arithmetic: row 1 has Hotel, City, the Stay group covering two columns, Guests, Total, which is six slots. Row 2 has the two cells under Stay plus the slots held by the four rowspans, again six. Every body row has six slots and the footer has five plus one.

`aria-sort="ascending"` sits on the Hotel header because the rows are sorted by hotel name. If a click on that header reverses the order, the script must change the value to `"descending"` and remove the attribute from any other header.

## Common mistakes

- Using a table for page layout. It breaks reading order, responsive design, and the landmark structure.
- Writing `table > tr` in CSS and wondering why nothing is selected. The browser inserted a `tbody`.
- Putting `caption` after `thead` or inside a `td`. It must be the first child of `table`.
- Using a heading or a paragraph above the table instead of `caption`, so screen reader users never hear the table name.
- Marking header cells with `td` and bold text. Without `th` there is no header for the screen reader to associate.
- Omitting `scope`. The default is `auto`, which guesses, and the guess fails as soon as spans appear.
- Counting cells instead of slots, so a `colspan` row silently adds an extra column to the whole table.
- A `rowspan` that reaches past the last row, which leaves cells pushed into a column that does not exist.
- Using `colspan="0"` or `rowspan="0"`. Avoid them.
- Letting `colgroup` declare a different number of columns than the widest row.
- Styling with `border`, `cellpadding`, `width` or `align` attributes. All are obsolete; use CSS.
- Leaving empty cells blank, so they vanish visually and get skipped by a screen reader.
- A horizontally scrolling table with no `tabindex` or region label, which a keyboard user cannot scroll.
- Marking a sorted column in the text ("sorted by price") but leaving `aria-sort` off the header.
- Putting a whole card, form, or paragraph into a cell. Tabular data only.
- Setting `thead th { position: sticky }` without a background, so rows show through the header.

## Exam checklist

1. The table holds data with row and column meaning, not layout.
2. `caption` is the first child and states what the table contains, including unit and period when relevant.
3. `thead`, `tbody` and, when needed, `tfoot` are used, and `tfoot` is last in the source.
4. Every header cell is a `th`, and every `th` has a `scope` of `col`, `row`, `colgroup` or `rowgroup`.
5. The first cell of a data row is a `th scope="row"` when the row is identified by it.
6. Every row covers the same number of column slots when spans are counted.
7. `colspan` and `rowspan` are positive integers, and no span reaches past the table edge.
8. `colgroup` matches the real column count.
9. `headers` and `id` are used only where `scope` cannot express the relationship.
10. `aria-sort` is on the sorted header and is updated by the sort code.
11. Numbers align right through a class, not through an obsolete attribute.
12. Empty cells show a dash or a word rather than nothing.
13. A wide table sits in a focusable, labelled scroll wrapper.
14. The table still reads correctly with CSS disabled and with the header repeated in print.
