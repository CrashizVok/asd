# Routes

React command · Routing

Picks the single best matching Route from its children and renders only that one.

## Syntax

```jsx
<Routes>{routeChildren}</Routes>
```

## Example

```jsx
import { Routes, Route } from 'react-router-dom';

// Specificity decides, not the order in this JSX.
<Routes>
    <Route path="/" element={<Home />} />
    <Route path="/hotels" element={<Hotels />} />
    <Route path="/hotels/:hotel_id" element={<HotelDetail />} />
    <Route path="*" element={<NotFound />} />
</Routes>
```

## Details

React Router 5 used `Switch`, which took the first match in source order. `Routes` ranks instead: a static segment beats a dynamic one, and a dynamic one beats a splat. That is why `*` can sit first and still lose.

A `Routes` only renders one child. If two elements must appear at once, one of them belongs in the parent as layout, or the URL needs a nested route with `Outlet`.
