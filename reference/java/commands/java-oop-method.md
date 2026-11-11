# instance method

Java command · Classes

Behaviour that runs with a this reference to the object it was called on, so it can read and write that object's fields.

## Syntax

```java
ReturnType name(parameters) { body }
```

## Example

```java
class Hotel {
    private int stars = 3;
    private double nightly = 90.0;

    boolean isLuxury() {
        return stars >= 4;
    }

    double totalFor(int nights) {
        if (nights < 1) {
            throw new IllegalArgumentException("nights must be at least 1");
        }
        return nightly * nights;
    }
}

Hotel h = new Hotel();
System.out.println(h.isLuxury());      // false
System.out.println(h.totalFor(3));     // 270.0
```

## Details

The signature is the name plus the parameter types. The return type is not part of it, so two methods cannot differ only by return type. A method with no parameters still has access to `this`, which is why `isLuxury()` can read `stars` without receiving the object as an argument.
