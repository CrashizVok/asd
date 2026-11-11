# var for local variables

Java command · Basics

Infers the type of a local variable from its initialiser. The type is fixed at compile time and the variable stays strongly typed.

## Syntax

```java
var name = initialValue;
```

## Example

```java
// File: VarUse.java
import java.util.ArrayList;

public class VarUse {
    public static void main(String[] args) {
        // the type comes from the right side and is fixed at compile time
        var cities = new ArrayList<String>();
        cities.add("Eger");

        // the element type is String, so length() type checks
        for (var city : cities) {
            System.out.println(city.length()); // 4
        }

        var total = 0; // int, not Object and not dynamic
        total += 3;
        System.out.println(total); // 3

        // not allowed: no initialiser, a field, or a method parameter
        // var missing;
    }
}
```

## Details

`var` is syntax for the compiler, not a type. `var x = 0;` declares an `int` and assigning a string later is the same error as with an explicit type.

Use it when the right side already spells the type, as in `var rows = new ArrayList<Booking>()`. Avoid it when the right side hides the type behind a method call, because the reader then has to open that method.
