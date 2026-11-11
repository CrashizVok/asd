# event object fields

JavaScript command · Events

Each dispatch creates one event object. target is where the event started, currentTarget is the node running the current listener.

## Syntax

```js
event.target
event.currentTarget
```

## Example

```js
const list = document.querySelector("#results");

list.addEventListener("click", (event) => {
  console.log(event.type);          // "click"
  console.log(event.target);        // innermost clicked element
  console.log(event.currentTarget); // the list
  console.log(event.isTrusted);     // true for a real user click
  console.log(event.cancelable);    // whether preventDefault applies
});
```

## Details

`currentTarget` is set to `null` after dispatch finishes, so do not read it inside a timeout. Store `event.target` in a variable if the value is needed later.

Keyboard events add `key`, `code`, `repeat`, and the modifier booleans. Submit events add `submitter`.
