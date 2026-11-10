# State

React topic · Exam Wiki

```jsx
import { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);

    return (
        <button onClick={() => setCount(count + 1)}>
            Clicked {count} times
        </button>
    );
}
```

For the next value based on the previous one, use the updater form:

```jsx
setCount(current => current + 1);
```

Never mutate state directly. Replace objects and arrays:

```jsx
setUser({ ...user, name: 'Anna' });
setItems([...items, newItem]);
setItems(items.filter(item => item.id !== id));
```
