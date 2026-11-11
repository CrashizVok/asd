# <Navigate>

React command · Navigation

Redirects during render. The declarative form of a redirect, used by protected routes.

## Syntax

```jsx
<Navigate to="/login" replace state={{ from: location }} />
```

## Example

```jsx
function RequireAuth({ children }) {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        // replace so the back button does not loop between login and the page
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return children;
}
```

## Details

`Navigate` renders nothing. It changes the location as soon as it renders, which makes it right inside a guard component and wrong inside a handler, where `useNavigate` is clearer.

The matching pair is a login page that sends the user back:

```jsx
const from = useLocation().state?.from?.pathname ?? '/';
navigate(from, { replace: true });
```
