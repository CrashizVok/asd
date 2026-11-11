# index route

React command · Routing

The child that renders when the parent path matches exactly and no other child does.

## Syntax

```jsx
<Route index element={<HotelList />} />
```

## Example

```jsx
<Route path="/hotels" element={<HotelsLayout />}>
    {/* /hotels shows the list inside the layout outlet */}
    <Route index element={<HotelList />} />
    <Route path=":hotel_id" element={<HotelDetail />} />
</Route>
```

## Details

`index` is a boolean flag, not a path. It cannot have children, because an index route is a leaf by definition.

Writing `<Route path="" element={...} />` in the same position does not match `/hotels` and is the usual cause of an empty page under a layout. Use `index`.
