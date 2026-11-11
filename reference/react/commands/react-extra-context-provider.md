# Context provider with a guard

React command · Components

Wraps useContext in a custom hook that throws when no provider is above. That turns a silent undefined into a clear error.

## Syntax

```jsx
export function useAuth() { const ctx = useContext(AuthContext); ... }
```

## Example

```jsx
import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // The value object is memoized so consumers skip needless renders
  const value = useMemo(() => ({ user, login: setUser, logout: () => setUser(null) }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}

// Usage: const { user, login } = useAuth();
```
