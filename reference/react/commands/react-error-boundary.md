# error boundary

React command · Patterns

Catches render errors in its child tree. It must be a class component. It does not catch event handler errors.

## Syntax

```jsx
class Boundary extends React.Component { componentDidCatch() {} }
```

## Example

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    return this.state.hasError ? <p>Something broke.</p> : this.props.children;
  }
}
```
