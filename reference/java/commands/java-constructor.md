# constructor

Java command · OOP

Runs when an object is created. It has the class name and no return type. Use this to separate fields from parameters.

## Syntax

```java
ClassName(params) { ... }
```

## Example

```java
class Guest {
    private final String name;
    private int nights;

    Guest(String name, int nights) {
        this.name = name;
        this.nights = nights;
    }
}
```
