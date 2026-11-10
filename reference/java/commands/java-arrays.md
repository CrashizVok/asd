# Arrays utility

Java command · Arrays

Helpers for arrays: sort, toString, copyOf, fill, equals, stream.

## Syntax

```java
Arrays.sort(array)
Arrays.toString(array)
```

## Example

```java
import java.util.Arrays;

int[] numbers = {4, 1, 3};
Arrays.sort(numbers);
System.out.println(Arrays.toString(numbers)); // [1, 3, 4]
int[] copy = Arrays.copyOf(numbers, 5);
```
