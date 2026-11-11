# parallelStream()

Java command · Streams

Splits the source across the fork join pool. It pays for large CPU bound work with independent elements and breaks on shared mutable state.

## Syntax

```java
collection.parallelStream()
```

## Example

```java
// File: ParallelCount.java
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class ParallelCount {

    public static void main(String[] args) {
        List<Integer> numbers = IntStream.rangeClosed(1, 500_000)
                .boxed()
                .collect(Collectors.toList());

        // Data shape: List<Integer> -> long.
        // Same answer as the sequential count, because the work per element
        // is independent and the result is a reduction.
        long odd = numbers.parallelStream()
                .filter(n -> n % 2 != 0)
                .count();
        System.out.println(odd); // 250000

        // Wrong: ArrayList is not thread safe, and forEach gives no ordering.
        // List<Integer> shared = new ArrayList<>();
        // numbers.parallelStream().forEach(shared::add);

        // Right: collect gives each thread its own container and merges at the end.
        List<Integer> big = numbers.parallelStream()
                .filter(n -> n > 499_990)
                .collect(Collectors.toList());
        System.out.println(big.size()); // 10
    }
}
```

## Details

`parallelStream()` splits the source across the common fork join pool. It pays for large CPU bound work and costs more than it saves on a small list or on IO.

`collect`, `reduce`, and `count` are safe because each thread owns a partial result. `forEach` writing into a shared `ArrayList` loses rows, since several threads resize the array at the same time. Use `collect(Collectors.toList())` instead.
