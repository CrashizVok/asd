# createElement

JavaScript command · DOM structure

Creates a detached element. It is not on the page until you insert it.

## Syntax

```js
document.createElement("li")
```

## Example

```js
// Data shape: { id: number, label: string }
const room = { id: 204, label: "Room 204" };

const item = document.createElement("li");
item.className = "room";
item.dataset.id = String(room.id);
item.textContent = room.label;

console.log(item.isConnected); // false, still detached
document.querySelector("#room-list").append(item);
console.log(item.isConnected); // true
```

## Details

For repeated markup, clone a `template` instead of building every node by hand:

```html
<template id="room-template">
  <li class="room"><span class="room-name"></span></li>
</template>
```

```js
const template = document.querySelector("#room-template");
const copy = template.content.cloneNode(true);
copy.querySelector(".room-name").textContent = "Room 204";
document.querySelector("#room-list").append(copy);
```

Listeners are not copied by `cloneNode`, so delegated events stay the simplest choice.
