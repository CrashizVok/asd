# Context

React topic · Exam Wiki

```jsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
    const [dark, setDark] = useState(false);
    return (
        <ThemeContext.Provider value={{ dark, setDark }}>
            {children}
        </ThemeContext.Provider>
    );
}

function Toggle() {
    const { dark, setDark } = useContext(ThemeContext);
    return <button onClick={() => setDark(!dark)}>Toggle</button>;
}
```

Use context for a value that many components need. Do not put every piece of state in a global store for a three-page exam app.
