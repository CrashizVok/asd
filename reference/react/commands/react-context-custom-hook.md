# context custom hook

React command · Context

Wraps useContext with a guard and a readable name. Keeps the context object private to its file.

## Syntax

```jsx
function useThing() { const v = useContext(Ctx); if (!v) throw new Error(...); return v; }
```

## Example

```jsx
import { useContext } from 'react';
import { CartStateContext } from './cart-context.js';

export function useCartItems() {
    const state = useContext(CartStateContext);

    if (!state) {
        throw new Error('useCartItems must be used inside CartProvider');
    }

    return state.items;
}

// In a component:
// const items = useCartItems();
```

## Details

Export the provider and the hooks, not the raw context. Then no file can read it and skip the guard, and renaming the shape later touches one file.

```jsx
// One hook per slice, so a component declares what it uses
export function useCartActions() {
    const actions = useContext(CartActionsContext);
    if (!actions) throw new Error('useCartActions must be used inside CartProvider');
    return actions;
}
```
