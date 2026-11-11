# DOM manipulation

JavaScript topic · Exam Wiki

## Simplest form

```js
// Data shape: { element: Element | null }
const title = document.querySelector('#page-title');
title.textContent = 'Bookings';
```

`querySelector` takes any CSS selector and returns the first matching element, or `null` when nothing matches. Nearly every DOM task starts with a selection like this and continues with a method on the result.

## What the DOM is

The browser parses HTML text into a tree of nodes held in memory. Element nodes are tags. Text nodes hold the characters between tags. Comment nodes hold comments. `document` is the entry object, `document.documentElement` is the `<html>` element, and `document.body` is the body element.

The tree is live. A variable holds a reference to a node, not a copy, so writing to that node changes the page at once. The reverse also holds: if you remove a node, your variable still points at it, but it is no longer in the document and the user cannot see it.

`childNodes` contains text and comment nodes as well as elements. `children` contains elements only. A newline between two tags is a text node, so `firstChild` often returns whitespace while `firstElementChild` returns what you expected.

Script placement matters. A script in `head` without `defer` runs before the body has been parsed, so `document.querySelector('h1')` returns `null`. Put the script at the end of `body` or add `defer` to the tag. With `defer` the browser waits for parsing, then runs scripts in order.

## Selecting elements

```js
// By id. The id is passed without the # sign.
const header = document.getElementById('site-header');

// By CSS selector. Any selector the browser accepts works here.
const firstCard = document.querySelector('.hotel-card');
const allCards = document.querySelectorAll('.hotel-card');

// Scoped search. Only descendants of the form are searched.
const form = document.querySelector('#booking-form');
const emailInput = form.querySelector('input[name="customer_email"]');

// Direct children only. :scope refers to the element itself.
const rows = document.querySelector('#room-list').querySelectorAll(':scope > li');
```

`getElementById` only exists on `document`, never on an element, and an id does not have to be a valid CSS selector. That makes it a safe choice when the id comes from data. A selector-based lookup parses CSS syntax instead, so ids that start with a digit or contain dots need escaping or a different method.

`querySelector` returns the first match in document order. It does not guess which one you meant, so a page with two `.card` blocks gives you the earlier one. When no element matches, the result is `null`, and the next line throws `Cannot read properties of null`. Guard the result when the element is optional:

```js
const banner = document.querySelector('.banner');
if (banner) {
  banner.textContent = 'Sale ends today';
}
```

`querySelectorAll` returns a `NodeList` that is a snapshot. It supports `forEach` and `for...of`, but not `map`, `filter`, or `sort`. Convert it when you need array methods:

```js
const cards = [...document.querySelectorAll('.hotel-card')];
const visible = cards.filter((card) => card.dataset.city === 'Budapest');
```

An invalid selector throws a `SyntaxError` instead of returning `null`. That matters when the selector is built from a string, for example `'[data-id="' + id + '"]'` where the id contains a quote. Prefer `dataset` comparisons for data values and keep selectors as literals.

The older collection methods behave differently and cause bugs. `getElementsByClassName` and `getElementsByTagName` return a live `HTMLCollection`, which changes while you iterate. Appending a matching element inside the loop can make the loop run forever. `querySelectorAll` does not have that problem because it does not update. `element.children` is a live collection too.

## Reading and writing content

```js
// Data shape: { text: string } for textContent writes
const note = document.querySelector('#note');

note.textContent;              // all text inside, without tags
note.textContent = 'Paid';     // replaces every child with one text node

note.innerHTML;                // serialized HTML string
note.innerHTML = '<b>Paid</b>'; // parses the string and builds nodes

note.innerText;                // visible rendered text, layout aware
```

`textContent` is the default for writing user or data values. It never parses markup, so a value like `<img src=x onerror=alert(1)>` shows as characters. Setting it deletes existing child nodes, and with them any listeners attached to those children.

`innerHTML` reads the current subtree as a string and writes it by parsing. It is convenient for trusted templates and dangerous for anything a user typed. An image with a broken source can run script through `onerror`, and sanitizing by hand is easy to get wrong:

```js
// Dangerous. The name comes from an input field.
card.innerHTML = '<h2>' + customerName + '</h2>';

// Safe. The name stays text.
const heading = document.createElement('h2');
heading.textContent = customerName;
card.append(heading);
```

`innerHTML +=` is worse than it looks. It reads the whole subtree, concatenates, and parses everything back. Every listener inside is lost, and every reference to a child points at a node that is no longer on the page. Add a node instead.

`outerHTML` writes the element and its subtree. Assigning it replaces the element itself, so the variable you used still points at the detached original.

`insertAdjacentHTML` parses a string at one of four positions: `beforebegin`, `afterbegin`, `beforeend`, `afterend`. It is useful for a trusted fragment and has the same injection risk as `innerHTML`.

`innerText` reads rendered text. It skips hidden elements, respects line breaks, and forces layout work, so it costs more than `textContent`. Use it when you need what the user sees. Do not use it to set values.

## Creating and inserting nodes

```js
// Data shape: { item: { id: number, label: string } }
const list = document.querySelector('#room-list');

const item = document.createElement('li');
item.className = 'room';
item.textContent = 'Room 204';
item.dataset.id = String(204);

list.append(item);        // inserts at the end, accepts nodes and strings
list.prepend(item);       // inserts at the start
item.before(list.firstElementChild); // sibling before the node
item.after(list.lastElementChild);   // sibling after the node
item.remove();            // detaches the node
```

`append` accepts several nodes and plain strings, which become text nodes. `appendChild` accepts one node and returns it. `prepend` mirrors `append` at the start. `before` and `after` insert siblings and need the node to have a parent. `replaceWith` swaps the node for new content, `replaceChildren` empties a parent and inserts the arguments in one call.

`insertBefore(newNode, referenceNode)` inserts before a reference. Pass `null` as the reference to append. `removeChild(child)` is the old form of `remove()` and throws when the child is not actually a child of that parent. `remove()` needs no parent and is safer.

When you add many nodes, insert them into a `DocumentFragment` first. The fragment is a container outside the document, so the browser does less work per node:

```js
// Data shape: [{ id: number, label: string }]
const fragment = document.createDocumentFragment();

for (const room of rooms) {
  const item = document.createElement('li');
  item.textContent = room.label;
  fragment.append(item);
}

document.querySelector('#room-list').append(fragment);
```

Appending the fragment inserts its children and empties the fragment. The nodes move, they are not copied.

`cloneNode(true)` copies an element and its subtree. Listeners added with `addEventListener` are not copied, and neither are properties you set on the object, such as `element._state`. Use cloning for a template:

```html
<template id="room-template">
  <li class="room"><span class="room-name"></span></li>
</template>
```

```js
const template = document.querySelector('#room-template');
const copy = template.content.cloneNode(true);
copy.querySelector('.room-name').textContent = 'Room 204';
```

## Classes, style, attributes, dataset

`classList` is the reliable way to work with classes:

```js
const card = document.querySelector('.hotel-card');

card.classList.add('is-open');
card.classList.remove('is-open');
card.classList.toggle('is-open');          // returns true when added
card.classList.toggle('is-open', false);   // force remove
card.classList.replace('is-open', 'is-closed');
card.classList.contains('is-open');        // boolean
```

Assigning `className` replaces the whole attribute and wipes classes you did not list. `classList` changes one class at a time and works the same on HTML and SVG elements. An SVG element's `className` is an object, not a string, which is another reason to use `classList`.

Inline styles are set through the `style` object. CSS property names with a dash become camelCase properties, or you use `setProperty` with the real name:

```js
panel.style.display = 'none';
panel.style.backgroundColor = '#f5f5f5';
panel.style.setProperty('background-color', '#f5f5f5');
panel.style.setProperty('--columns', '3');

panel.style.removeProperty('display');
panel.removeAttribute('style'); // clears every inline style
```

Reading `style.display` returns only the inline value, which is an empty string when the rule comes from a stylesheet. Use `getComputedStyle(element)` for the value that actually applies. It returns resolved values, such as `'rgb(245, 245, 245)'` and pixel lengths, and it is read only.

Prefer a class over inline style when the visual state has a name. `card.classList.add('is-hidden')` keeps the CSS in the stylesheet where it can be reviewed. Inline styles win over stylesheet rules, so a forgotten inline value is hard to override later.

The `hidden` property reflects the `hidden` attribute. The browser's default stylesheet hides it, but an author rule such as `display: flex` can override that, so `hidden` is not a guaranteed hide. `aria-hidden` is unrelated: it hides content from assistive technology while leaving it on screen.

Attributes are strings:

```js
const link = document.querySelector('#details-link');

link.getAttribute('href');            // literal value from the HTML
link.setAttribute('href', '/rooms');  // writes a string
link.hasAttribute('target');          // boolean
link.removeAttribute('target');

link.setAttribute('data-open', 'true');
link.getAttribute('data-open');       // "true", not true
```

Properties and attributes are not the same thing. `input.value` is the current text, while `getAttribute('value')` returns the default written in the HTML. `input.checked` is the current state, while `defaultChecked` reflects the attribute. `link.href` is resolved to an absolute URL, while `getAttribute('href')` returns what the author wrote. Boolean attributes work by presence: `setAttribute('disabled', 'false')` still disables the control because the attribute exists.

`dataset` is the doorway to `data-*` attributes. A dash followed by a letter becomes a capital letter:

```js
// <li data-hotel-id="42" data-city="Budapest">
const item = document.querySelector('li');

item.dataset.hotelId;       // "42"
item.dataset.city;          // "Budapest"
item.dataset.hotelId = 7;   // writes data-hotel-id="7", always a string
delete item.dataset.city;   // removes the attribute
```

Everything in `dataset` is a string. A number read from it needs `Number(...)`, and a missing key reads as `undefined`. Attribute names in HTML are lowercased by the parser, so `data-hotelId` in markup becomes `data-hotelid` and does not match `dataset.hotelId`.

## Forms

```js
// Data shape: { customer_email: string, adults: string, rooms: boolean }
const form = document.querySelector('#booking-form');

form.elements.customer_email.value;  // current text
form.elements.adults.value;          // "2", always a string
form.elements.rooms.checked;         // checkbox state

const data = new FormData(form);
data.get('customer_email');
Object.fromEntries(data);            // plain object, repeated names lost
```

`form.elements` holds the controls and allows lookup by `name`. A name that matches a form property, such as `submit` or `action`, shadows that property and confuses readers, so name fields carefully. Radio buttons with the same name form a group, and `form.elements.rooms.value` returns the selected value or an empty string.

All control values are strings. A number input gives `"3"`, and an empty or partially typed value gives `""`. A date input gives `"2026-11-11"` or `""`. Convert with `Number()` and validate the result.

`FormData` collects the successful controls, which excludes disabled fields, unchecked checkboxes, and the submit button unless you pass it as the second argument: `new FormData(form, event.submitter)`. Repeated names need `getAll`. Files arrive as `File` objects.

Validation is split between the browser and your code. The browser blocks the `submit` event when a constraint fails, so a handler never runs for an invalid form unless the form has `novalidate`. Within a handler, `form.checkValidity()` runs the checks, `form.reportValidity()` shows the browser messages, and `input.setCustomValidity('')` clears a custom error. Use `form.noValidate = true` when you want full control and your own error messages.

`form.reset()` restores default values and fires a `reset` event. Calling `form.submit()` skips validation and the submit event, so prefer `form.requestSubmit()` when you want the normal path.

## Cost of DOM work

Reading a layout property such as `offsetHeight` or calling `getBoundingClientRect()` makes the browser calculate layout. If you write to the DOM and then read in the same loop, each pass forces another layout. The pattern is called layout thrashing:

```js
// Slow. Every iteration writes, then reads.
for (const row of rows) {
  row.style.width = '100px';
  console.log(row.offsetHeight);
}

// Better. Read once, then write.
const heights = rows.map((row) => row.offsetHeight);
rows.forEach((row, index) => {
  row.style.width = heights[index] + 'px';
});
```

Batch with a `DocumentFragment`, change classes instead of many inline properties, and measure before the writes when you need a number. For a hundred rows this rarely matters. For a thousand it does.

## Examples

### Example 1: render a list from data

```js
// Data shape:
// [{ hotel_id: 1, name: "Danube View", city: "Budapest", stars: 4 }]
const hotels = [
  { hotel_id: 1, name: 'Danube View', city: 'Budapest', stars: 4 },
  { hotel_id: 2, name: 'Hill Court', city: 'Eger', stars: 3 },
  { hotel_id: 3, name: 'Lake House', city: 'Siofok', stars: 5 },
];

const list = document.querySelector('#hotel-list');
const fragment = document.createDocumentFragment();

for (const hotel of hotels) {
  const item = document.createElement('li');
  item.className = 'hotel-card';
  item.dataset.hotelId = String(hotel.hotel_id); // used later by click handlers
  item.dataset.city = hotel.city;                // lets a filter run without parsing text

  const name = document.createElement('h2');
  name.textContent = hotel.name;

  const meta = document.createElement('p');
  meta.textContent = hotel.city + ', ' + hotel.stars + ' stars';

  item.append(name, meta);
  fragment.append(item);
}

list.replaceChildren(fragment); // one insertion, no leftover rows
```

The code builds nodes instead of a string, so a hotel name with `<` or `&` stays text. `replaceChildren` clears the previous render in the same call that inserts the new one.

### Example 2: filter rows with a class

```js
// Data shape: { query: string, cards: Element[] }
const search = document.querySelector('#hotel-search');
const cards = [...document.querySelectorAll('.hotel-card')];

search.addEventListener('input', () => {
  const query = search.value.trim().toLowerCase();

  for (const card of cards) {
    // City was cached in data-city during render
    const city = card.dataset.city.toLowerCase();
    const name = card.querySelector('h2').textContent.toLowerCase();
    const match = city.includes(query) || name.includes(query);

    card.classList.toggle('is-hidden', !match); // CSS owns display: none
  }
});
```

The input value is read once per event. The class decides visibility, so the CSS stays in one place and the filter does not rebuild the list. A filter that removes nodes loses focus and scroll position; hiding with a class avoids both.

### Example 3: validate a form and write errors into the page

```js
// Data shape: { customer_email: string, first_name: string, adults: string }
const form = document.querySelector('#booking-form');
const summary = document.querySelector('#booking-summary');

function setError(input, message) {
  const box = document.querySelector('#' + input.id + '-error');
  box.textContent = message; // safe even when the message contains markup

  if (message) {
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', box.id);
  } else {
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault(); // stop the page navigation
  const data = new FormData(form);
  let firstInvalid = null;

  const email = String(data.get('customer_email') ?? '').trim();
  const name = String(data.get('first_name') ?? '').trim();
  const adults = Number(data.get('adults'));

  if (!name) {
    setError(form.elements.first_name, 'Enter the guest name');
    firstInvalid = firstInvalid || form.elements.first_name;
  } else {
    setError(form.elements.first_name, '');
  }

  if (!email.includes('@') || email.endsWith('@')) {
    setError(form.elements.customer_email, 'Enter a valid email address');
    firstInvalid = firstInvalid || form.elements.customer_email;
  } else {
    setError(form.elements.customer_email, '');
  }

  if (!Number.isInteger(adults) || adults < 1) {
    setError(form.elements.adults, 'At least one adult');
    firstInvalid = firstInvalid || form.elements.adults;
  } else {
    setError(form.elements.adults, '');
  }

  if (firstInvalid) {
    firstInvalid.focus(); // keyboard users land on the problem
    return;
  }

  summary.textContent = name + ' booked for ' + adults + ' adults.';
  form.reset();
});
```

The `aria-invalid` and `aria-describedby` attributes connect the message to the field for screen readers. `textContent` writes the message, so the same helper is safe for any text. Focus moves to the first error, which is what a keyboard user needs.

The markup gives each field an error box with a matching id, such as `<p id="first_name-error"></p>` next to the first name input. The helper reads the field id, appends `-error`, and finds that box.

### Example 4: a booking table with sort, filter, delete, and a total

This program keeps all state in one object and rebuilds the table body after every change. The data set is small, so a full rebuild is simpler than patching single cells and it cannot drift out of sync.

```html
<table id="bookings">
  <thead>
    <tr>
      <th><button type="button" data-sort="name">Hotel</button></th>
      <th><button type="button" data-sort="city">City</button></th>
      <th><button type="button" data-sort="stars">Stars</button></th>
      <th><button type="button" data-sort="price">Price</button></th>
      <th></th>
    </tr>
  </thead>
  <tbody id="bookings-body"></tbody>
  <tfoot>
    <tr><td colspan="3">Total</td><td id="bookings-total"></td><td></td></tr>
  </tfoot>
</table>
<select id="city-filter" aria-label="Filter by city">
  <option value="">All cities</option>
  <option value="Budapest">Budapest</option>
  <option value="Eger">Eger</option>
</select>
```

```js
// Data shape:
// [{ hotel_id: number, name: string, city: string, stars: number, price: number }]
const bookings = [
  { hotel_id: 1, name: 'Danube View', city: 'Budapest', stars: 4, price: 320 },
  { hotel_id: 2, name: 'Hill Court', city: 'Eger', stars: 3, price: 180 },
  { hotel_id: 3, name: 'Lake House', city: 'Siofok', stars: 5, price: 410 },
  { hotel_id: 4, name: 'Chain Bridge Inn', city: 'Budapest', stars: 2, price: 95 },
];

// One state object. Every handler edits this and calls render.
const state = {
  sortKey: 'name',
  direction: 1,   // 1 ascending, -1 descending
  city: '',
};

const tbody = document.querySelector('#bookings-body');
const totalCell = document.querySelector('#bookings-total');
const cityFilter = document.querySelector('#city-filter');

function visibleRows() {
  const rows = bookings.filter((row) => !state.city || row.city === state.city);

  return rows.sort((a, b) => {
    const left = a[state.sortKey];
    const right = b[state.sortKey];
    if (left < right) return -1 * state.direction;
    if (left > right) return 1 * state.direction;
    return 0;
  });
}

function render() {
  const fragment = document.createDocumentFragment();
  let total = 0;

  for (const row of visibleRows()) {
    total += row.price;

    const tr = document.createElement('tr');
    tr.dataset.hotelId = String(row.hotel_id); // the delete handler reads this

    for (const value of [row.name, row.city, row.stars, row.price]) {
      const td = document.createElement('td');
      td.textContent = String(value); // numbers become safe text
      tr.append(td);
    }

    const actionCell = document.createElement('td');
    const remove = document.createElement('button');
    remove.type = 'button'; // without this the button submits a surrounding form
    remove.className = 'row-delete';
    remove.dataset.action = 'delete';
    remove.textContent = 'Remove';
    actionCell.append(remove);
    tr.append(actionCell);

    fragment.append(tr);
  }

  tbody.replaceChildren(fragment); // single write, old rows gone
  totalCell.textContent = String(total);
}

// Sorting. The buttons carry the key, so one listener covers the header.
document.querySelector('#bookings thead').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-sort]');
  if (!button) return; // a click on the padding, not on a button

  const key = button.dataset.sort;

  if (state.sortKey === key) {
    state.direction *= -1; // second click reverses the order
  } else {
    state.sortKey = key;
    state.direction = 1;
  }

  render();
});

// Deleting. The listener sits on the body, so rebuilt rows keep working.
tbody.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action="delete"]');
  if (!button) return;

  const row = button.closest('tr');
  const id = Number(row.dataset.hotelId);
  const index = bookings.findIndex((item) => item.hotel_id === id);

  if (index !== -1) bookings.splice(index, 1); // mutate the data, then redraw
  render();
});

cityFilter.addEventListener('change', () => {
  state.city = cityFilter.value; // read once, store in state
  render();
});

render(); // first paint
```

Two details do the work. `closest` walks up from the real click target to the button and then to the row, so a click on the button text works the same as a click on its padding. `replaceChildren` throws away the old rows after the new ones are built, which keeps the visible table in one consistent state.

## Common mistakes

- Using `innerHTML +=` to add one row. It re-parses the whole list, drops listeners, and detaches every old node.
- Treating a `NodeList` from `querySelectorAll` as live. It is a snapshot, and it does not update when the page changes.
- Iterating a live `HTMLCollection` while adding matching elements. The collection grows under the loop.
- Forgetting the `null` case. A missing id or a renamed class turns into `Cannot read properties of null` on the next line.
- Writing a number into `dataset` and expecting a number back. Values are stored and returned as strings.
- Assigning `className` to add one class. It replaces every existing class.
- Using `el.style.background-color`. The property is `backgroundColor`, or use `setProperty`.
- Reading `input.getAttribute('value')` for the current text. That is the default value; the live one is `input.value`.
- Calling `stopPropagation` when the goal was to stop the browser default. That is `preventDefault`.
- Appending the same node twice and expecting two copies. The node moves; clone it when you need a copy.
- Selecting `firstChild` and getting a whitespace text node. Use `firstElementChild`.
- Hiding with the `hidden` attribute while a stylesheet sets `display` on the same element. The author rule wins.

## Exam checklist

- Can you get one element by id and one by selector, and say what each returns when nothing matches?
- Can you explain why `querySelectorAll` returns a snapshot while `getElementsByClassName` stays live?
- Can you set text safely and say why `innerHTML` with user input is dangerous?
- Can you build ten rows with a fragment and insert them in one call?
- Can you add, remove, toggle, and test a class without touching `className`?
- Can you set and remove an inline style, including a custom property?
- Can you read a `data-*` value and convert it to a number?
- Can you explain the difference between the `value` property and the `value` attribute?
- Can you read every field of a form into one object, and say which fields `FormData` skips?
- Can you clear and set a validation message and connect it to the field for assistive technology?
- Can you name one DOM pattern that causes repeated layout work and one way to avoid it?

