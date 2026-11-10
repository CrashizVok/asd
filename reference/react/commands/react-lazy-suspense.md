# lazy and Suspense

React command · Patterns

Loads a component only when it is needed. Suspense shows a fallback while the code loads.

## Syntax

```jsx
const Page = lazy(() => import("./Page"));
<Suspense fallback={<p>Loading...</p>}>
```

## Example

```jsx
const Bookings = lazy(() => import("./pages/Bookings"));

<Suspense fallback={<p>Loading...</p>}>
  <Bookings />
</Suspense>
```
