# BrowserRouter

React command · Routing

Provides the history object and the current location to the whole tree. Mount one per app, usually in main.jsx or at the top of App.

## Syntax

```jsx
<BrowserRouter>{children}</BrowserRouter>
```

## Example

```jsx
import { BrowserRouter } from 'react-router-dom';

// One router for the app. Every routing hook below it reads this context.
createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
```

## Details

Two other routers exist for two other problems.

`HashRouter` puts the path after `#` (`/app#/hotels`), so the server never sees it and no rewrite rule is needed. Use it only when the host cannot serve `index.html` for unknown paths.

`MemoryRouter` keeps the history in memory with no address bar at all, which is what tests want.

Never render a second `BrowserRouter` deeper in the tree. Each one creates its own history, so the inner router shows a different location than the outer one and links stop agreeing with the address bar.
