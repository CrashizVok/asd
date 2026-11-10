# extends

Java command · OOP

A subclass inherits fields and methods. Call super(...) first when the parent has a constructor with arguments.

## Syntax

```java
class Child extends Parent { ... }
```

## Example

```java
class Room {
    protected int number;

    Room(int number) {
        this.number = number;
    }
}

class Suite extends Room {
    Suite(int number) {
        super(number);
    }
}
```
