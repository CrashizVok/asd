# StringBuilder

Java command · Core

Builds a string with mutable buffers. Concatenation in a loop creates a new String each time, append does not.

## Syntax

```java
new StringBuilder().append(value).toString()
```

## Example

```java
// File: BuildCsv.java
import java.util.List;

public class BuildCsv {
    public static void main(String[] args) {
        List<String> cities = List.of("Budapest", "Eger", "Gyor");

        StringBuilder builder = new StringBuilder();
        builder.append("city").append(',').append("index").append(System.lineSeparator());

        for (int i = 0; i < cities.size(); i++) {
            // append returns the builder, so calls can chain
            builder.append(cities.get(i)).append(',').append(i).append(System.lineSeparator());
        }

        String csv = builder.toString();
        System.out.print(csv);

        // insert and delete work in place, no new object is created
        builder.insert(0, "# ");
        System.out.println(builder.substring(0, 2)); // "# "
        System.out.println(builder.length());
    }
}
```
