# Error boundaries

React topic · Exam Wiki

```jsx
import { Component } from "react";

class ErrorBoundary extends Component {
    state = { error: null };

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, info) {
        console.error(error, info);
    }

    render() {
        if (this.state.error) {
            return <p>Something went wrong.</p>;
        }
        return this.props.children;
    }
}
```

An error boundary catches render errors in its children. It does not catch event handler errors, async errors, or errors in itself. Wrap a route or a risky panel, not the whole app.
