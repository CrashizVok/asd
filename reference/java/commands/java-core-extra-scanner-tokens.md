# Scanner nextInt() and nextLine()

Java command · Input

Reads whitespace separated tokens or a whole line. The hasNext method guards the read, and nextLine after nextInt needs one extra call.

## Syntax

```java
scanner.nextInt() / scanner.nextLine()
```

## Example

```java
// File: ReadTokens.java
import java.util.Scanner;

public class ReadTokens {
    public static void main(String[] args) {
        // Scanner splits on whitespace by default
        Scanner scanner = new Scanner("4 12 7");
        int count = scanner.nextInt();
        int sum = 0;
        while (scanner.hasNextInt()) {
            sum += scanner.nextInt();
        }
        System.out.println(count + " " + sum); // 4 19
        scanner.close();

        // nextInt leaves the line break in the buffer, so clear it first
        Scanner lines = new Scanner("42\nAnna");
        int number = lines.nextInt();
        lines.nextLine();               // swallows the empty rest of the line
        System.out.println(number + " " + lines.nextLine()); // 42 Anna
        lines.close();
    }
}
```

## Details

`Scanner` reads tokens, not records. A file with one field per line therefore needs `nextLine` plus a `split` rather than a chain of `next` calls, unless the order of the fields is fixed and the file has no blank lines.

Close a scanner that wraps a file or a stream. Closing a scanner over `System.in` also closes the shared stream, which matters in a program that reads twice.
