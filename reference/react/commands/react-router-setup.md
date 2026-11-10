# BrowserRouter and Routes

React command · Routing

React Router maps URLs to components. BrowserRouter uses the History API; HashRouter works on static file hosts.

## Syntax

```jsx
<BrowserRouter><Routes><Route ... /></Routes></BrowserRouter>
```

## Example

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/hotels/:id" element={<Bookings />} />
  </Routes>
</BrowserRouter>
```
