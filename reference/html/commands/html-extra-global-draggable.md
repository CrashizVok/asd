# draggable

HTML command · Global attributes

Opts an element into the native drag and drop API. The dragged element sets data on dragstart, the target reads it on drop.

## Syntax

```html
draggable="true"
```

## Example

```html
<!-- native drag and drop, no library needed -->
<div draggable="true" id="card-17" ondragstart="start(event)">Booking A-17</div>
<div id="done" ondragover="event.preventDefault()" ondrop="drop(event)">Done</div>

<script>
  function start(event) {
    event.dataTransfer.setData('text/plain', 'A-17');
  }
  function drop(event) {
    event.preventDefault();
    console.log(event.dataTransfer.getData('text/plain'));
  }
</script>
```
