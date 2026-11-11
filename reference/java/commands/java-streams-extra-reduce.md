# reduce()

Java command · Streams

Folds every element into one value. With an identity the result is never Optional; without one it is empty for an empty stream.

## Syntax

```java
stream().reduce(identity, accumulator)
```

## Example

```java
// File: Fold.java
import java.util.List;
import java.util.Optional;

public class Fold {

    public static void main(String[] args) {
        List<Integer> numbers = List.of(4, 7, 2, 9);

        // Data shape: List<Integer> -> int, then Optional<Integer>.
        // identity + accumulator: the identity also covers the empty stream.
        int sum = numbers.stream().reduce(0, Integer::sum);
        System.out.println(sum); // 22

        // No identity means Optional, because an empty stream has no answer.
        Optional<Integer> max = numbers.stream().reduce(Integer::max);
        System.out.println(max.orElse(-1)); // 9

        // Fold into another type, here a joined string. joining is clearer
        // for this job, but the shape of reduce is the same.
        String trail = numbers.stream()
                .map(String::valueOf)
                .reduce("", (acc, s) -> acc.isEmpty() ? s : acc + "-" + s);
        System.out.println(trail); // 4-7-2-9

        // Three argument form: identity, accumulator, combiner. The combiner
        // is what a parallel stream uses to join two partial results.
        int total = numbers.stream().reduce(0, Integer::sum, Integer::sum);
        System.out.println(total);
    }
}
```

## Details

With an identity the result type is the identity type, and an empty stream returns that identity. Without one the result is `Optional`, because there is nothing to return.

The three argument form adds a combiner. A parallel stream uses it to join partial results, so the accumulator and the combiner must agree or the sequential and parallel answers differ.
