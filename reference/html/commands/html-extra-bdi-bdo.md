# <bdi> and <bdo>

HTML command · Semantic text

bdi isolates a run of text so its direction cannot reorder the surrounding sentence. bdo forces a direction on its content.

## Syntax

```html
<bdi>user text</bdi>
```

## Example

```html
<ul>
  <li>User <bdi>إبراهيم</bdi> booked 2 rooms</li>
  <li>User <bdi>Ann</bdi> booked 1 room</li>
</ul>

<!-- bdo overrides the inherited direction -->
<bdo dir="rtl">Room 101</bdo>
```
