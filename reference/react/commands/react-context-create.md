# createContext()

React command · Context

Creates a named channel. The argument is only used when no provider exists above the consumer.

## Syntax

```jsx
const Ctx = createContext(defaultValue);
```

## Example

```jsx
import { createContext } from 'react';

// Data shape: { dark: boolean, toggle: () => void }
const ThemeContext = createContext(null);

// A provider later supplies the real value:
// <ThemeContext.Provider value={value}>...</ThemeContext.Provider>

// Declare the context at module level. Inside a component it
// would be rebuilt on every render and all consumers would remount.
```

## Details

The default value is a fallback, not initial state. It never updates.

```jsx
const LocaleContext = createContext('en');

function Price({ amount }) {
    const locale = useContext(LocaleContext);
    return <span>{new Intl.NumberFormat(locale).format(amount)}</span>;
}

// No provider: the component still renders with 'en'
<Price amount={12500} />
```

Use `null` when a missing provider is a bug you want your own hook to catch. Use a real value when a standalone fallback makes sense.
