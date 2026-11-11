# StringBuilder in a loop

Java command · Strings

Appends into one growable buffer instead of copying the string on every pass. Required when a loop builds a report line by line.

## Syntax

```java
sb.append(value)
```

## Example

```java
// File: BuildReport.java
import java.util.List;

public class BuildReport {
    public static void main(String[] args) {
        List<String> cities = List.of("Budapest", "Eger", "Gyor");

        // One buffer, three appends per line. Concatenation would copy the
        // whole text on every pass and allocate a new string each time.
        StringBuilder report = new StringBuilder();
        for (int i = 0; i < cities.size(); i++) {
            report.append(i + 1).append(": ").append(cities.get(i)).append('\n');
        }
        System.out.print(report);

        // setLength(0) empties the buffer without allocating a new one
        report.setLength(0);
        report.append("abc").reverse();
        System.out.println(report); // cba

        // substring on a builder returns a String
        System.out.println(new StringBuilder("Budapest").substring(0, 4)); // Buda
    }
}
```

## Details

`append` returns the same builder, so the calls chain. `toString` copies the buffer at that moment: a later append cannot change the string you already took, which is why printing a snapshot and printing the builder differ.

A builder is not thread safe. If two threads append, wrap the writes in a `synchronized` block or use `StringBuffer`, which is the synchronized version of the same class.
