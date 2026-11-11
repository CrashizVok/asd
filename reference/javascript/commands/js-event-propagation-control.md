# stopPropagation and stopImmediatePropagation

JavaScript command · Event flow

stops the event from moving to the next node. It does not cancel the browser default action, which is preventDefault. Immediate also skips the remaining listeners on the current node.

## Syntax

```js
event.stopPropagation()
event.stopImmediatePropagation()
```

## Example

```js
function openDetails(id) {
  console.log("open", id);
}

const row = document.querySelector('tr[data-id="4"]');
const remove = row.querySelector("button.delete");

remove.addEventListener("click", (event) => {
  event.stopPropagation(); // the row click must not open details
  row.remove();
});

row.addEventListener("click", () => openDetails(row.dataset.id));
```

## Details

A `stopPropagation` call on a link does not stop the navigation. Use `preventDefault` for that, and check `event.cancelable` when the event may not support cancellation.

Order the checks inside one delegated listener before reaching for propagation control. It is easier to follow and cannot silently break other features.
