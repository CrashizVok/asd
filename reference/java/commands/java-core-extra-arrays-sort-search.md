# Arrays.sort() and binarySearch()

Java command · Arrays

Sorts an array in place and searches a sorted array. The search only works after the sort, and a miss returns a negative insertion point.

## Syntax

```java
Arrays.sort(array) / Arrays.binarySearch(array, key)
```

## Example

```java
// File: SortScores.java
import java.util.Arrays;

public class SortScores {
    public static void main(String[] args) {
        int[] scores = {42, 7, 19, 88};

        // ascending and in place, no new array is returned
        Arrays.sort(scores);
        System.out.println(Arrays.toString(scores)); // [7, 19, 42, 88]

        // a hit returns the index, a miss returns -(insertion point) - 1
        System.out.println(Arrays.binarySearch(scores, 42)); // 2
        System.out.println(Arrays.binarySearch(scores, 50)); // -4

        // strings sort by natural order, which is uppercase before lowercase
        String[] cities = {"eger", "Budapest", "Gyor"};
        Arrays.sort(cities);
        System.out.println(Arrays.toString(cities)); // [Budapest, Gyor, eger]
    }
}
```

## Details

Primitive arrays take no comparator. For a descending `int[]` there are two normal choices: sort ascending and walk it backwards, or box the values into an `Integer[]` and pass `Comparator.reverseOrder()`.

`Arrays.toString` prints one dimension. A nested array needs `Arrays.deepToString`, otherwise you see the reference of each row.
