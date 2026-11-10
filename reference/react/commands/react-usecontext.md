# useContext

React command · Hooks

Reads a value from the nearest provider without passing props through every level.

## Syntax

```jsx
const value = useContext(MyContext);
```

## Example

```jsx
const ThemeContext = createContext("light");

function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Save</button>;
}

<ThemeContext.Provider value="dark">
  <Button />
</ThemeContext.Provider>
```
