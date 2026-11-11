# <Ctx.Provider value>

React command · Context

Publishes a value to every consumer below it. The nearest provider wins.

## Syntax

```jsx
<Ctx.Provider value={value}>{children}</Ctx.Provider>
```

## Example

```jsx
import { createContext, useMemo, useState } from 'react';

// Data shape: { city: string, setCity: (city: string) => void }
const CityContext = createContext(null);

export function CityProvider({ children }) {
    const [city, setCity] = useState('');

    // New object on every render would re-render every consumer
    const value = useMemo(() => ({ city, setCity }), [city]);

    return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}
```

## Details

`value` is compared by reference. A literal object is new on every provider render, so every consumer re-renders with it. Memoize the object, or publish a primitive when possible.

```jsx
// Stable while dark is unchanged
const value = useMemo(() => ({ dark, toggle }), [dark, toggle]);

// Also fine: a primitive compares by value
<ThemeContext.Provider value={dark ? 'dark' : 'light'}>
```
