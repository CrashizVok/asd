# Box model

CSS topic · Exam Wiki

Every element is content, padding, border, margin, in that order.

```css
.box {
  width: 300px;
  padding: 16px;
  border: 1px solid #ddd;
  margin: 24px auto;
  box-sizing: border-box; /* width includes padding and border */
}
```

`content-box` is the default: `width` covers content only, so the real size grows. Set `box-sizing: border-box` on `*` and stop guessing. Vertical margins collapse between siblings; padding does not. `margin: 0 auto` centers a block with a set width.
