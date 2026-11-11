# remove and replaceChildren

JavaScript command · DOM structure

remove takes the element out of the document without needing its parent. replaceChildren clears the parent and inserts the new nodes in one call.

## Syntax

```js
element.remove()
parent.replaceChildren(...nodes)
```

## Example

```js
const row = document.querySelector("tr.is-selected");
if (row) row.remove();

const list = document.querySelector("#room-list");

// Clear everything in one call
list.replaceChildren();

// Build new content and swap it in
const item = document.createElement("li");
item.textContent = "Room 410";
list.replaceChildren(item);
```

## Details

A removed node still exists in memory while a variable points at it. Its listeners still run if you keep a reference and dispatch events on it, but the user cannot see it and CSS no longer applies.

`removeChild(child)` throws when the node is not a child of that parent. `remove()` has no such failure mode.
