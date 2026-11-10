# extends and super

JavaScript command · Classes

Creates a subclass. super calls the parent constructor or method.

## Syntax

```js
class Child extends Parent { constructor() { super(); } }
```

## Example

```js
class Room {
  constructor(number) {
    this.number = number;
  }
}

class Suite extends Room {
  constructor(number) {
    super(number);
    this.kitchen = true;
  }
}
```
