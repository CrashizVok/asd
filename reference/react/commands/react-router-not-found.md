# 404 route

React command · Routing

A splat route that catches every URL no other route matched.

## Syntax

```jsx
<Route path="*" element={<NotFound />} />
```

## Example

```jsx
<Routes>
    <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="hotels" element={<Hotels />} />
        {/* root catch all, keeps the layout */}
        <Route path="*" element={<NotFound />} />
    </Route>
</Routes>
```

## Details

`*` matches one or more segments, including slashes, so it catches `/a/b/c`. Put it inside the layout route to keep the header on the error page.

A section can have its own 404 to keep its own chrome:

```jsx
<Route path="hotels" element={<HotelsLayout />}>
    <Route index element={<HotelList />} />
    <Route path=":hotel_id" element={<HotelDetail />} />
    <Route path="*" element={<SectionNotFound />} />
</Route>
```

Order in JSX does not matter, specificity does: `:hotel_id` beats `*`. If the section 404 never shows, a root `*` or a missing `Outlet` in the layout is the cause. Always put a `Link` home in the 404 body.
