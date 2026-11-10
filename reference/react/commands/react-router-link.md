# Link and NavLink

React command · Routing

Link navigates without a full page reload. NavLink adds an active class.

## Syntax

```jsx
<Link to="/hotels">Hotels</Link>
```

## Example

```jsx
import { Link, NavLink } from "react-router-dom";

<Link to="/hotels">All hotels</Link>
<NavLink to="/search" className={({ isActive }) => isActive ? "active" : ""}>
  Search
</NavLink>
```
