# Collectors.joining

Java command · Streams

Joins stream elements into one string with a delimiter, plus optional prefix and suffix. Elements must already be strings.

## Syntax

```java
stream.collect(Collectors.joining(delimiter, prefix, suffix))
```

## Example

```java
// File: JoinNames.java
import java.util.List;
import java.util.stream.Collectors;

public class JoinNames {
    public static void main(String[] args) {
        List<String> names = List.of("Danube View", "City Loft", "Lake Garden");

        System.out.println(names.stream().collect(Collectors.joining(", ")));
        // Danube View, City Loft, Lake Garden

        // Prefix and suffix are useful for SQL lists and CSV lines
        String quoted = names.stream()
            .map(name -> "'" + name + "'")
            .collect(Collectors.joining(", ", "(", ")"));
        System.out.println(quoted); // ('Danube View', 'City Loft', 'Lake Garden')

        // An empty stream still returns the prefix and suffix
        System.out.println(List.<String>of().stream().collect(Collectors.joining(", ", "[", "]")));
        // []
    }
}
```
