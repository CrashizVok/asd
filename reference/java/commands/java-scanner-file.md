# Scanner on a file

Java command · Reading

Reads whitespace separated tokens from a file and converts them with nextInt, nextDouble, or next. Close it when done.

## Syntax

```java
new Scanner(Path.of("scores.txt"), StandardCharsets.UTF_8)
```

## Example

```java
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.Scanner;

public class ReadScores {
    public static void main(String[] args) throws IOException {
        try (Scanner scanner = new Scanner(Path.of("scores.txt"), StandardCharsets.UTF_8)) {
            double sum = 0;
            int count = 0;
            while (scanner.hasNextDouble()) {
                sum += scanner.nextDouble();
                count++;
            }
            System.out.println(count == 0 ? "no data" : "avg=" + (sum / count));
        }
    }
}
```

## Details

`hasNextDouble` stops at a word instead of throwing. The classic trap is mixing `nextInt` with `nextLine`: `nextInt` leaves the newline in the buffer, so the next `nextLine` returns an empty string. Read whole lines and split them when the file has records.
