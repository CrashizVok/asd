# useMemo

React command · Hooks

Caches the result of an expensive calculation until a dependency changes. Do not use it for every small value.

## Syntax

```jsx
const value = useMemo(() => compute(a), [a]);
```

## Example

```jsx
const sorted = useMemo(() => {
  return [...hotels].sort((a, b) => a.name.localeCompare(b.name));
}, [hotels]);
```
