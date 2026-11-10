# Meta viewport

HTML topic · Exam Wiki

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

Without it, a phone renders the page at desktop width and zooms out. With it, CSS pixels match the device. Do not add `user-scalable=no`; it blocks pinch zoom and fails accessibility checks.
