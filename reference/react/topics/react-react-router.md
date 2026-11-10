# React Router

React topic · Exam Wiki

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/hotels/:id" element={<Bookings />} />
                <Route path="/search/:searchedWord" element={<SearchResult />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
```

`main.jsx` usually holds the `BrowserRouter` and `App` holds the `Routes`. Either split works, but keep one router.
