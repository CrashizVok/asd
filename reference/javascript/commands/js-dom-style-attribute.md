# style and setAttribute

JavaScript command · DOM

style changes inline CSS. setAttribute changes any HTML attribute; removeAttribute removes it.

## Syntax

```js
element.style.color = "red"
element.setAttribute("aria-hidden", "true")
```

## Example

```js
const panel = document.querySelector(".panel");
panel.style.display = "none";
panel.setAttribute("aria-hidden", "true");
panel.removeAttribute("aria-hidden");
```
