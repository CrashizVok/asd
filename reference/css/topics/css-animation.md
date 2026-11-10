# Animation

CSS topic · Exam Wiki

```css
.fade-in {
  animation: fade-in 0.4s ease-out both;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.button {
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.button:hover {
  background-color: #1d4ed8;
  transform: translateY(-1px);
}

@media (prefers-reduced-motion: reduce) {
  * { animation: none; transition: none; }
}
```

`animation` runs a keyframe sequence; `transition` animates a property change. `both` keeps the final state. Respect `prefers-reduced-motion` for people who get motion sickness.
