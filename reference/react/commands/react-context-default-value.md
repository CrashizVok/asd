# default value

React command · Context

The fallback only applies when no provider is above the consumer. It is not state and never changes.

## Syntax

```jsx
createContext(fallback)
```

## Example

```jsx
// Fallback that works without a provider
const LocaleContext = createContext('en');

function Standalone() {
    const locale = useContext(LocaleContext);
    return <p>{locale}</p>; // 'en'
}

function Wrapped() {
    return (
        <LocaleContext.Provider value="de">
            <Standalone /> {/* 'de' */}
        </LocaleContext.Provider>
    );
}
```

## Details

`createContext()` with no argument gives `undefined`, and the failure appears later as a destructuring error that does not mention context. Either pass a usable fallback or pass `null` and guard in a custom hook.
