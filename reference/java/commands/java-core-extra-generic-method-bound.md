# Generic method with a bound

Java command · Generics

Declares a type parameter and limits it to comparable types, so the body may call compareTo and the return type stays concrete.

## Syntax

```java
static <T extends Comparable<T>> T max(List<T> items)
```

## Example

```java
// File: Largest.java
import java.util.List;

public class Largest {
    // The bound allows compareTo and keeps the return type as T
    static <T extends Comparable<T>> T largest(List<T> items) {
        T best = items.get(0);
        for (T item : items) {
            if (item.compareTo(best) > 0) {
                best = item;
            }
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(largest(List.of(4, 19, 7)));               // 19
        System.out.println(largest(List.of("Eger", "Gyor", "Baja"))); // Gyor
    }
}
```

## Details

Without the bound, `compareTo` is not a method of `T` and the body does not compile. With the bound, the compiler knows the argument implements `Comparable` of itself.

Type parameters are erased at run time. That is why `new T[]`, `instanceof T`, and `T.class` fail, and why a generic class cannot have a static field of type `T`.
