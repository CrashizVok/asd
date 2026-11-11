# Custom unchecked exception

Java command · Exceptions

An unchecked type for a mistake the caller should not repeat. No throws clause anywhere, and one handler at the edge that can still turn it into a message.

## Syntax

```java
class DuplicateHotelException extends RuntimeException
```

## Example

```java
// File: DuplicateHotelException.java
// Data shape: DuplicateHotelException { name: String }, unchecked
import java.util.HashSet;
import java.util.Set;

public class DuplicateHotelException extends RuntimeException {

    private final String name;

    public DuplicateHotelException(String name) {
        super("hotel already exists: " + name);
        this.name = name;
    }

    public DuplicateHotelException(String name, Throwable cause) {
        super("hotel already exists: " + name, cause);
        this.name = name;
    }

    public String name() {
        return name;
    }

    static void add(Set<String> names, String name) {
        if (!names.add(name)) {
            // Unchecked because the caller passed a duplicate, and no retry helps.
            throw new DuplicateHotelException(name);
        }
    }

    public static void main(String[] args) {
        Set<String> names = new HashSet<>();
        add(names, "Danube View");
        try {
            add(names, "Danube View");
        } catch (DuplicateHotelException e) {
            System.out.println(e.getMessage() + " -> " + e.name());
        }
    }
}
```

## Details

Use this when the failure means the caller broke a rule that a check would have caught: a duplicate key, an illegal state transition, a missing required field. The signature stays clean and the compiler stops forcing empty catches.

The trade is discoverability. Nothing in the signature warns the reader, so document it in Javadoc or validate at the entry point. A good compromise is a checked type at the file or network boundary and unchecked types inside the domain.
