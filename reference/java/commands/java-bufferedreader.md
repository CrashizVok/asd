# BufferedReader

Java command · Files

Reads text line by line. It is memory-friendly for large files. Use try-with-resources.

## Syntax

```java
new BufferedReader(new FileReader("file.txt"))
```

## Example

```java
import java.io.*;

try (BufferedReader br = new BufferedReader(new FileReader("data.txt"))) {
    String line;
    while ((line = br.readLine()) != null) {
        System.out.println(line);
    }
}
```
