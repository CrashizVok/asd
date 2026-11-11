# useNavigate()

React command · Hooks

Returns a function that navigates from code: after a POST, after a failed auth check, after a timeout.

## Syntax

```jsx
const navigate = useNavigate();
```

## Example

```jsx
const navigate = useNavigate();

navigate('/hotels');                          // push a new entry
navigate(-1);                                // one step back
navigate('/login', { replace: true });       // replace the current entry
navigate('/hotels/7', { state: { from: 'search' } });
```

## Details

`{ replace: true }` keeps the page the user just left out of the history stack. Use it after login, after a delete, and after submitting a form, otherwise the back button returns to a page that no longer makes sense and a refresh repeats the action.

`state` lives in the history entry, not in the URL. It survives a refresh of that entry and is lost when the link is copied, so it suits "return where you came from" and nothing that must be shareable.

Read it with `useLocation().state` and guard the first visit: `location.state?.from?.pathname ?? '/'`.
