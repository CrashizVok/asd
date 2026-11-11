# enum with fields and methods

Java command · OOP

Gives each constant its own data through a private constructor. The constant list comes first, fields and methods after it.

## Syntax

```java
enum Type { A(1), B(2); private final int x; }
```

## Example

```java
// File: RoomTypes.java
public class RoomTypes {
    enum Type {
        SINGLE(80), DOUBLE(120); // each constant is an instance

        private final int price; // fields come after the constants

        Type(int price) { // the constructor is implicitly private
            this.price = price;
        }

        int total(int nights) {
            return price * nights;
        }

        static Type of(String name) { // a clear failure instead of null
            return Type.valueOf(name.toUpperCase());
        }
    }

    public static void main(String[] args) {
        Type type = Type.of("double");
        System.out.println(type);                 // DOUBLE
        System.out.println(type.total(3));        // 360
        System.out.println(type.ordinal());       // 1
        System.out.println(Type.values().length); // 2
    }
}
```
