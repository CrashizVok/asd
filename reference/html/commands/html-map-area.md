# <map> and <area>

HTML command · Links and media

Defines clickable areas on an image. The img usemap attribute points to the map name.

## Syntax

```html
<map name="m"><area shape="rect" coords="0,0,50,50" href="a.html"></map>
```

## Example

```html
<img src="plan.png" usemap="#rooms" alt="Hotel plan">
<map name="rooms">
  <area shape="rect" coords="10,10,80,60" href="room-a.html" alt="Room A">
</map>
```
