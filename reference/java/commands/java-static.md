# static

Java command · OOP

Belongs to the class, not to an instance. Static methods cannot use instance fields directly.

## Syntax

```java
static int count;
```

## Example

```java
class Counter {
    static int count = 0;

    static void increment() {
        count++;
    }
}

Counter.increment();
System.out.println(Counter.count); // 1
```
