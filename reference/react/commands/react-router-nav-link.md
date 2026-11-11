# NavLink

React command · Navigation

Link with an isActive flag for the current URL, used for menus and tab bars.

## Syntax

```jsx
<NavLink to="/hotels" className={({ isActive }) => (isActive ? 'on' : '')}>Hotels</NavLink>
```

## Example

```jsx
// end stops '/hotels' from staying active on '/hotels/7'
<NavLink to="/" end className={({ isActive }) => (isActive ? 'nav on' : 'nav')}>
    Home
</NavLink>
<NavLink
    to="/hotels"
    style={({ isActive }) => ({ fontWeight: isActive ? 700 : 400 })}
>
    Hotels
</NavLink>
```

## Details

The default match is a prefix match. `to="/hotels"` is active on `/hotels` and on `/hotels/7`. Add `end` when only the exact URL should count, and always add it on the home link, or `to="/"` matches every path.

`className` and `style` accept a function that receives `{ isActive, isPending }`, so no comparison against `useLocation().pathname` is needed.
