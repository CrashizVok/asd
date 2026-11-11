# onload

HTML command · Events

Runs after the page and its images, styles and frames have loaded. DOMContentLoaded is usually the better moment for script setup.

## Syntax

```html
<body onload="init()">
```

## Example

```html
<body onload="init()">
  <img id="hero" src="img/hotel.jpg" alt="Hotel entrance">
  <script>
    function init() {
      // images are loaded here, so naturalWidth is known
      console.log(document.getElementById('hero').naturalWidth);
    }
  </script>
</body>
```
