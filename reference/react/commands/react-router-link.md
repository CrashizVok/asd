# Link

React command · Navigation

Renders an anchor and navigates on click without reloading the document.

## Syntax

```jsx
<Link to="/hotels/7">Hotel</Link>
```

## Example

```jsx
import { Link } from 'react-router-dom';

// to accepts a string or an object
<Link to="/hotels">All hotels</Link>
<Link to={`/hotels/${hotel.hotel_id}`}>{hotel.name}</Link>

// no new history entry, the back button skips this step
<Link to="/login" replace>Sign in</Link>
```

## Details

The rendered `<a>` carries a real `href`, so ctrl click, middle click and "open in new tab" behave normally. A plain `<a href>` reloads the page and drops React state, which is the bug `Link` prevents.

For a path built from parts, `to` also takes an object: `{ pathname: '/hotels', search: '?city=Eger' }`. String interpolation is shorter and reads fine for one param.
