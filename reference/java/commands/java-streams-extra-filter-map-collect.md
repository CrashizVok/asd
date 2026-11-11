# filter, map, collect

Java command · Streams

Keeps the rows that pass, changes what each row is, and stores the result. Nothing runs until the terminal operation.

## Syntax

```java
list.stream().filter(p).map(f).toList()
```

## Example

```java
// File: PipelineBasics.java
import java.util.List;

public class PipelineBasics {

    record Booking(String city, int nights) {
    }

    public static void main(String[] args) {
        List<Booking> bookings = List.of(
                new Booking("Budapest", 3),
                new Booking("Praha", 1),
                new Booking("Vienna", 2));

        // Data shape: List<Booking> in, List<String> out.
        List<String> labels = bookings.stream()
                .filter(b -> b.nights() >= 2)           // keep some rows
                .map(b -> b.city() + "/" + b.nights())  // change the row shape
                .sorted()                               // order what is left
                .toList();                              // terminal: this runs the pipeline

        System.out.println(labels); // [Budapest/3, Vienna/2]
    }
}
```

## Details

Order matters. `filter` before `map` keeps the lambdas small and drops rows before any conversion, while `map` before `filter` forces the test to read the new element type. The source list is never changed, and the whole chain runs once, at the terminal call.
