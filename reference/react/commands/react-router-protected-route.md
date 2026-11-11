# protected route

React command · Security

A wrapper component that renders its children only when the user is signed in, otherwise redirects to login.

## Syntax

```jsx
<Route path="/admin" element={<RequireAuth><Admin /></RequireAuth>} />
```

## Example

```jsx
// App.jsx
<Route
    path="/admin"
    element={
        <RequireAuth>
            <Admin />
        </RequireAuth>
    }
/>

// auth state comes from a context or a store, not from the router
const { user } = useAuth();
```

## Details

Client side protection hides UI. It is not security: anyone can call `/api/admin` with curl. The API must verify the session on every request, and the route guard is only the part that avoids showing a broken page.

For a whole section, wrap the layout route instead of every child:

```jsx
<Route element={<RequireAuth><AdminLayout /></RequireAuth>}>
    <Route path="/admin" element={<Dashboard />} />
    <Route path="/admin/bookings" element={<Bookings />} />
</Route>
```
