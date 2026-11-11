# layout route

React command · Layout

A route with no path that carries shared chrome and renders its children in an outlet.

## Syntax

```jsx
<Route element={<Layout />}>{children}</Route>
```

## Example

```jsx
<Routes>
    {/* no path: matches whatever the children match */}
    <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="hotels" element={<Hotels />} />
        <Route path="search" element={<HotelSearch />} />
        <Route path="*" element={<NotFound />} />
    </Route>
</Routes>
```

## Details

Pathless routes are how a header, sidebar or footer is written once. Children use relative paths, so `hotels` becomes `/hotels` at the root level.

Layouts nest: a pathless `Layout` can hold a `/hotels` route that has its own `HotelsLayout`, each with an `Outlet`. The order of the outlets decides where the page lands.

A layout route is not the same as an `index` route. An index route is a leaf that fills the parent outlet, a layout route is a parent that provides one.
