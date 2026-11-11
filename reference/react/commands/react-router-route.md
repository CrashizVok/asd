# Route

React command · Routing

Maps a path pattern to one element. Relative paths nest under the parent route and must not start with a slash.

## Syntax

```jsx
<Route path="/hotels/:hotel_id" element={<HotelDetail />} />
```

## Example

```jsx
<Route path="/hotels" element={<HotelsLayout />}>
    {/* index: renders on /hotels exactly */}
    <Route index element={<HotelList />} />
    {/* relative: becomes /hotels/:hotel_id */}
    <Route path=":hotel_id" element={<HotelDetail />} />
    <Route path="*" element={<SectionNotFound />} />
</Route>
```

## Details

`element` takes JSX, so props are free: `<Route path="/admin" element={<Admin role="owner" />} />`.

The 6.4 spelling `<Route path="/hotels" Component={Hotels} />` passes the component type instead and lets the data router keep the element mounted across param changes. Both work, `element` is the one to write in an exam.

The v4 and v5 `component={Hotels}` and `render={...}` props are gone. A lowercase `component` renders nothing and gives no warning.
