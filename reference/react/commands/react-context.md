# createContext and Provider

React command · Patterns

Shares a value with a tree of components. Use it for theme, language, or the current user, not for every prop.

## Syntax

```jsx
const Ctx = createContext(null);
<Ctx.Provider value={value}>
```

## Example

```jsx
const UserContext = createContext(null);

function App() {
  const [user, setUser] = useState({ name: "Anna" });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Profile />
    </UserContext.Provider>
  );
}
```
