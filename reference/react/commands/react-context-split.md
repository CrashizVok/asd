# split state and actions

React command · Context

Two contexts instead of one object: readers subscribe to state, writers get a value that never changes.

## Syntax

```jsx
const StateCtx = createContext(null);
const ActionsCtx = createContext(null);
```

## Example

```jsx
// Data shape: state { items: Array<{ id: number, name: string }> }
// Data shape: actions { add: (name: string) => void }
const ActionsContext = createContext(null);
const StateContext = createContext(null);

function Provider({ children }) {
    const [state, dispatch] = useReducer(reducer, { items: [] });
    const add = useCallback((name) => dispatch({ type: 'add', name }), []);
    const actions = useMemo(() => ({ add }), [add]);

    return (
        <ActionsContext.Provider value={actions}>
            <StateContext.Provider value={state}>{children}</StateContext.Provider>
        </ActionsContext.Provider>
    );
}
```

## Details

A component that only calls `add` reads the actions context and never re-renders when the list changes. That is the cheapest performance fix available in a context-heavy tree, and it costs one extra `createContext` line.

Split further only when a real problem shows: a large list where only the count is displayed, for example.
