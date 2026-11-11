# toString

Java command · Classes

Returns the text used by println, logging, and string concatenation. Without it the output is a class name and a hash.

## Syntax

```java
@Override public String toString() { ... }
```

## Example

```java
class Hotel {
    private final String name;
    private final int stars;

    Hotel(String name, int stars) {
        this.name = name;
        this.stars = stars;
    }

    @Override
    public String toString() {
        return "Hotel[" + name + ", " + stars + " stars]";
    }
}

Hotel h = new Hotel("Danube View", 4);
System.out.println(h);                        // Hotel[Danube View, 4 stars]
System.out.println("picked: " + h);           // picked: Hotel[Danube View, 4 stars]
System.out.println(new Hotel("Hilltop", 3));  // calls toString implicitly
```

## Details

`println` calls `String.valueOf(object)`, which calls `toString()` unless the reference is null. Concatenation does the same. Put the identifying fields in the output, not every field: a log line that dumps a whole object graph is unreadable. Records generate a readable `toString` already, so override only when the default is too noisy.
