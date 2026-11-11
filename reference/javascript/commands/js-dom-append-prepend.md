# append, prepend, before, after

JavaScript command · DOM structure

append inserts at the end and accepts several nodes and strings. prepend inserts at the start, and before and after insert siblings next to a node.

## Syntax

```js
parent.append(node)
```

## Example

```js
const list = document.querySelector("#room-list");

const first = document.createElement("li");
first.textContent = "Room 101";
list.prepend(first);

const last = document.createElement("li");
last.textContent = "Room 305";
list.append(last, " (new)"); // the string becomes a text node

const note = document.createElement("p");
note.textContent = "Prices include breakfast";
list.after(note); // sibling after the whole list
```

## Details

`appendChild` accepts one node only and returns it. `append` returns nothing and takes any number of arguments.

Appending a node that is already in the document moves it. Clone it when you need a second copy.
