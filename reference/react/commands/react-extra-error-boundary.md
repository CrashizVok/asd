# Error boundary

React command · Components

Catches render errors in its subtree and shows a fallback. There is no hook version, so it stays a class component.

## Syntax

```jsx
class Boundary extends Component { static getDerivedStateFromError() {} }
```

## Example

```jsx
import { Component } from "react";

class ErrorBoundary extends Component {
  state = { error: null };

  // Called during render, so it only updates state
  static getDerivedStateFromError(error) {
    return { error };
  }

  // Side effects such as logging belong here
  componentDidCatch(error, info) {
    console.error("Hotel page failed", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div>
          <p>Something failed.</p>
          <button onClick={() => this.setState({ error: null })}>Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
```
