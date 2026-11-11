# toMap with a merge function

Java command · Collectors

Builds a map from the rows. The merge function decides what happens when two rows produce the same key.

## Syntax

```java
collect(toMap(key, value, merge, mapFactory))
```

## Example

```java
// File: MergeMap.java
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

public class MergeMap {

    record Booking(String hotel, int total) {
    }

    public static void main(String[] args) {
        List<Booking> bookings = List.of(
                new Booking("Danube View", 240),
                new Booking("City Inn", 120),
                new Booking("Danube View", 80));

        // Data shape: Map<String, Integer>, hotel to revenue, sorted keys.
        // The third argument is the merge function. Without it the second
        // Danube View row throws IllegalStateException: Duplicate key.
        Map<String, Integer> revenue = bookings.stream()
                .collect(Collectors.toMap(
                        Booking::hotel,     // key
                        Booking::total,     // value
                        Integer::sum,       // merge two rows with the same key
                        TreeMap::new));     // optional: map implementation
        System.out.println(revenue); // {City Inn=120, Danube View=320}

        // The merge function can keep the later row instead of adding the two.
        Map<String, Integer> last = bookings.stream()
                .collect(Collectors.toMap(Booking::hotel, Booking::total, (left, right) -> right));
        System.out.println(last);
    }
}
```

## Details

Without the merge function a repeated key throws `IllegalStateException: Duplicate key`. `Integer::sum` and `(left, right) -> left + right` are the same merge here. The merge function is also where a different rule lives, such as keeping the later row with `(left, right) -> right`.

The fourth argument is optional and changes only the map implementation, for example `TreeMap::new` for sorted keys.
