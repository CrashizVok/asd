# useContext()

React command · Context

Reads the nearest provider value. The component re-renders when that value changes.

## Syntax

```jsx
const value = useContext(Ctx);
```

## Example

```jsx
import { useContext } from 'react';
import { ThemeContext } from './theme-context.js';

function Toolbar() {
    // Data shape: { dark: boolean, toggle: () => void }
    const { dark, toggle } = useContext(ThemeContext);

    return (
        <button className={dark ? 'dark' : 'light'} onClick={toggle}>
            Menu
        </button>
    );
}
```

## Details

There is no selector. A component that reads `{ user, cart }` re-renders when either one changes, even if it only displays the cart.

The hook must be called at the top level, never inside a condition, a loop, or a callback.
