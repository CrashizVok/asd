# safe text vs parsed HTML

JavaScript command · DOM content

textContent writes plain text and is safe for user input. innerHTML parses markup, and injected attributes such as onerror can run script.

## Syntax

```js
element.textContent = "text"
element.innerHTML = "<b>text</b>"
```

## Example

```js
const name = '<img src=x onerror=alert(1)>';
const box = document.querySelector("#box");

box.textContent = name;      // shows the characters
console.log(box.innerHTML);  // escaped markup, no element created

// Only for markup you control
box.innerHTML = "<strong>Confirmed</strong>";
```

## Details

`innerHTML +=` re-parses the whole subtree and replaces every child. Listeners on the old children are lost, and variables holding them point at detached nodes.

`innerText` reads rendered text and forces layout. Use `textContent` unless the visible text, with line breaks and hidden elements, is what you need.
