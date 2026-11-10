# Transitions

CSS topic · Exam Wiki

```css
.btn {
  transition: background-color 0.2s ease, transform 0.2s ease;
}
.btn:hover { background-color: #1558b0; transform: translateY(-2px); }
```

Transition the property that actually changes. `all` is slow and unpredictable on big elements. Keep durations between 150 and 300 ms for interface feedback.
