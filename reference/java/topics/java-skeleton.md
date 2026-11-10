# Skeleton

Java topic · Exam Wiki

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class BookingsCli {

    public static void main(String[] args) throws IOException {
        if (args.length == 0) {
            System.out.println("Usage: java BookingsCli bookings.csv");
            return;
        }

        List<String> lines = Files.readAllLines(Path.of(args[0]));
        System.out.println("Rows: " + lines.size());
    }
}
```

`throws IOException` on `main` is fine for an exam. The JVM prints the stack trace, which tells you the missing file or the permission problem.
