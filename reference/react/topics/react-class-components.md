# Class components

React topic · Exam Wiki

```jsx
import { Component } from "react";

class Counter extends Component {
    state = { count: 0 };

    add = () => {
        this.setState({ count: this.state.count + 1 });
    };

    render() {
        return <button onClick={this.add}>{this.state.count}</button>;
    }
}
```

Older React code uses classes. `state` is an object, `setState` merges a partial update, and `this` must be bound or use an arrow method. New code uses function components and hooks; read a class only when the exam or an existing file uses one.
