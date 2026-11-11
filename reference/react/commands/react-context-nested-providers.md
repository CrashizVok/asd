# nested providers

React command · Context

The nearest provider wins for everything inside it. Nesting is legal and useful for a modal or a preview pane.

## Syntax

```jsx
<Ctx.Provider value={outer}><Ctx.Provider value={inner}>...</Ctx.Provider></Ctx.Provider>
```

## Example

```jsx
function App() {
    return (
        <ThemeContext.Provider value="light">
            <Page />
            <ThemeContext.Provider value="dark">
                <Preview /> {/* reads "dark" */}
            </ThemeContext.Provider>
        </ThemeContext.Provider>
    );
}
```

## Details

An accidental second provider is a silent override: the outer value is simply ignored below it. When a component shows the wrong value, walk up the tree and count the providers before changing any state.
