# React.lazy and Suspense

React command · Components

Splits a component into its own chunk and loads it on demand. Suspense shows a fallback while the chunk downloads.

## Syntax

```jsx
const Page = lazy(() => import('./Page'))
```

## Example

```jsx
import { lazy, Suspense } from "react";

// The import runs only when the component is first rendered
const HotelPage = lazy(() => import("./HotelPage"));

export default function App({ showHotels }) {
  return (
    <Suspense fallback={<p>Loading hotels...</p>}>
      {showHotels && <HotelPage />}
    </Suspense>
  );
}

// The default export of HotelPage.jsx is what lazy resolves
// A named export needs a mapping:
// const HotelPage = lazy(() =>
//   import("./HotelPage").then((module) => ({ default: module.HotelPage }))
// );
```
