# generics

Java command · OOP

Lets a class or method work with a type chosen by the caller, with compile-time checking.

## Syntax

```java
class Box<T> { T value; }
```

## Example

```java
class Box<T> {
    private T value;

    void set(T value) {
        this.value = value;
    }

    T get() {
        return value;
    }
}

Box<String> box = new Box<>();
box.set("hello");
```
