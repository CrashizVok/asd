# abstract class and method

Java command · OOP

An abstract class cannot be instantiated. Subclasses must implement abstract methods.

## Syntax

```java
abstract class Shape { abstract double area(); }
```

## Example

```java
abstract class Shape {
    abstract double area();
}

class Square extends Shape {
    double side = 2;

    double area() {
        return side * side;
    }
}
```
