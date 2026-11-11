# style and getComputedStyle

JavaScript command · DOM styling

style edits inline CSS. Dash names become camelCase properties, or use setProperty. getComputedStyle returns the resolved value that applies.

## Syntax

```js
element.style.display = "none"
```

## Example

```js
const panel = document.querySelector(".panel");

panel.style.display = "none";
panel.style.backgroundColor = "#f5f5f5";
panel.style.setProperty("--columns", "3");

panel.style.removeProperty("display");

const width = getComputedStyle(panel).width;
console.log(width); // resolved value such as "320px"
```

## Details

Reading `panel.style.width` returns only the inline value, an empty string when the width comes from a stylesheet.

Prefer a class for a named state. Inline styles beat stylesheet rules, so a forgotten inline value is hard to override later.
