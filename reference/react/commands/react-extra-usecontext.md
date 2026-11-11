# useContext

React command · Hooks

Reads the nearest provider value without prop drilling. The component re-renders when that value changes.

## Syntax

```jsx
const value = useContext(MyContext)
```

## Example

```jsx
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext("light");

function Toolbar() {
  // Any component below the provider can read the theme
  const theme = useContext(ThemeContext);
  return <button className={theme}>Save</button>;
}

export default function App() {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={theme}>
      <Toolbar />
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle theme
      </button>
    </ThemeContext.Provider>
  );
}
```
