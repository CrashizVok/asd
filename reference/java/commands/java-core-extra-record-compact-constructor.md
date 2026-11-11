# record with a compact constructor

Java command · OOP

Declares an immutable data class and validates the components in a compact constructor. The compiler writes the accessors, equals, hashCode, and toString.

## Syntax

```java
record Name(Type field, ...) { Name { ... } }
```

## Example

```java
// File: Guest.java
public class Guest {
    record Row(String email, int nights) {
        // A compact constructor checks the values before the fields are set
        Row {
            if (email == null || !email.contains("@")) {
                throw new IllegalArgumentException("bad email");
            }
            if (nights < 1) {
                throw new IllegalArgumentException("bad nights: " + nights);
            }
        }

        // a derived value is a method, not a stored field
        int price(int nightly) {
            return nights * nightly;
        }
    }

    public static void main(String[] args) {
        Row row = new Row("anna@example.com", 3);
        System.out.println(row.email());   // anna@example.com
        System.out.println(row.price(80)); // 240

        // equals compares the components, so it is data equality
        System.out.println(row.equals(new Row("anna@example.com", 3))); // true
        System.out.println(row); // Row[email=anna@example.com, nights=3]
    }
}
```

## Details

The compact form repeats the component list only in the header. Inside the body you assign to the parameter name, and the compiler writes the field assignment after your code, so a normalised value is what gets stored.

Records cannot extend a class, cannot declare extra instance fields, and are final. They can implement an interface, which is enough for the exam tasks that ask for a sortable or printable row.
