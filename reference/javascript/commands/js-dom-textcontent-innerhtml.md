# textContent and innerHTML

JavaScript command · DOM

textContent sets plain text safely. innerHTML parses HTML; never insert untrusted input with it.

## Syntax

```js
element.textContent = "text"
element.innerHTML = "<b>text</b>"
```

## Example

```js
const box = document.querySelector("#box");
box.textContent = "Hello";
box.innerHTML = "<strong>Hello</strong>";
```
