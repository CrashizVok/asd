# bubbling and capture

JavaScript command · Event flow

Capture runs from the root down, then the target handler runs, then the event bubbles back up. focus, blur, mouseenter, mouseleave, load, and scroll on an element do not bubble.

## Syntax

```js
el.addEventListener("click", fn, true)
```

## Example

```js
document.addEventListener("click", () => console.log("capture"), true);
document.addEventListener("click", () => console.log("bubble"));

const button = document.querySelector("#save");
button.addEventListener("click", () => console.log("target"));

// Clicking the button logs: capture, target, bubble
```

## Details

Use `focusin` and `focusout` for focus delegation, because `focus` and `blur` do not bubble. `mouseover` and `mouseout` bubble where `mouseenter` and `mouseleave` do not.

A capturing listener is the only way to observe a non-bubbling event on an ancestor.
