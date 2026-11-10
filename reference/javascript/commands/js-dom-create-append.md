# createElement and append

JavaScript command · DOM

Creates a new element and inserts it. append accepts nodes and strings; appendChild accepts nodes only.

## Syntax

```js
const el = document.createElement("li")
parent.append(el)
```

## Example

```js
const list = document.querySelector("ul");
const item = document.createElement("li");
item.textContent = "New booking";
list.append(item);
```
