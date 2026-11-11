# stable callback with updater

React command · Memoization

Reads the previous state through the updater instead of closing over the current value, so the array can stay empty.

## Syntax

```jsx
const fn = useCallback(() => setValue((old) => old + 1), []);
```

## Example

```jsx
// Reads text, so it must depend on text
const submitOld = useCallback(() => send(text), [text]);

// Reads no outside value, so it never changes
const clear = useCallback(() => setText(''), []);

const append = useCallback(() => {
    setText((old) => old + '!');
}, []);
```

## Details

This is the cheapest way to keep a handler stable and correct at the same time. The moment the callback reads a state value directly, that value belongs in the dependency array, and the stable identity is gone.
