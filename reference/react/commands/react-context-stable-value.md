# memoized provider value

React command · Context

Keeps the provider value identical between renders so consumers do not re-render for nothing.

## Syntax

```jsx
const value = useMemo(() => ({ a, b }), [a, b]);
```

## Example

```jsx
function Provider({ children }) {
    const [dark, setDark] = useState(false);

    const toggle = useCallback(() => setDark((old) => !old), []);

    // Without useMemo the object below is new on every render
    const value = useMemo(() => ({ dark, toggle }), [dark, toggle]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
```

## Details

Memoizing the object is not enough if a field inside it is unstable. A plain `toggle` function is recreated on every render, so the memoized object still changes. Wrap the function in `useCallback` first, then the object.
