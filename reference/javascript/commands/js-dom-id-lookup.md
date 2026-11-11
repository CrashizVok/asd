# element by id

JavaScript command · DOM selection

Finds the element with that id and returns null when no element has it. The id is passed without the # sign, and the method exists only on document.

## Syntax

```js
document.getElementById("content")
```

## Example

```js
const content = document.getElementById("content");

if (content) {
  content.textContent = "Loaded";
} else {
  console.warn("#content is missing from the page");
}
```

## Details

An id such as `room.204` is awkward in a CSS selector, because the dot means a class. `getElementById` takes the raw string and does not parse it, which makes it the safer call when the id comes from data.
