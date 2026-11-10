# useContext

React topic · Exam Wiki

```jsx
import { createContext, useContext } from "react";

const ThemeContext = createContext("light");

function Toolbar() {
    const theme = useContext(ThemeContext);
    return <button className={theme}>Menu</button>;
}

function App() {
    return (
        <ThemeContext.Provider value="dark">
            <Toolbar />
        </ThemeContext.Provider>
    );
}
```

`createContext` makes the channel, `Provider` supplies the value, and `useContext` reads the nearest provider. A component that reads the context re-renders when the value changes. Do not put a new object in the value on every render unless you memoize it.
