# Java file input and output

Java topic · Exam Wiki

## Simplest form

```java
// Data shape: Path -> List<String>, one element per line, newline removed
List<String> lines = Files.readAllLines(Path.of("bookings.csv"));

// Data shape: Path + List<String> -> file on disk, one line per element
Files.write(Path.of("out.txt"), List.of("first", "second"));
```

Imports: `java.nio.file.Files`, `java.nio.file.Path`, `java.util.List`. Both calls throw `IOException`, so `main` can declare `throws IOException` and stop worrying about it.

## What it does

The JDK ships two file APIs. `java.io` is the old stream layer: `File`, `FileReader`, `BufferedReader`, `FileWriter`, `BufferedWriter`. `java.nio.file` is the newer one: `Path`, `Files`, plus the same buffered readers and writers. For an exam, open paths with `Path`, open small files with `Files`, and use `BufferedReader` or `BufferedWriter` when the file is large or when you want one line at a time.

Three decisions cover almost every task: whole file or line by line, text or bytes, read or write and for a write, replace or append. The charset is the fourth decision and the one that usually goes wrong. `Files.readAllLines` and `Files.readString` decode as UTF-8. `new FileReader` and `new FileWriter` use the platform default, which on a Windows exam machine can be Cp1250, so accented characters survive the round trip as question marks. Pass `StandardCharsets.UTF_8` wherever a charset fits, or build the reader with `Files.newBufferedReader`.

## Every part

### Path

A `Path` is an address, not a file. `Path.of("data", "bookings.csv")` joins the parts with the separator of the current machine, so `data/bookings.csv` on Linux and `data\bookings.csv` on Windows. `Paths.get` does the same on Java 7 to 10. Constructing a `Path` does not check that anything exists.

Relative paths resolve against the working directory, which is the folder where you ran `java`, not the folder that holds the `.java` file. When a read fails for no visible reason, print `Path.of("bookings.csv").toAbsolutePath()` and compare.

### Files.readAllLines

Reads the whole file, splits on `\n`, `\r\n`, or `\r`, and returns a mutable `List<String>`. The terminators are gone. A file whose last line has no newline still yields that last line, and a file ending in a newline does not produce an extra empty element. This is the fastest thing to write and the right choice under a few megabytes. On a 2 GB log it throws `OutOfMemoryError`, which no catch block will save.

### Files.readString

Returns the whole file as one `String`, newlines included. Use it for a small template, a JSON document, or when the task counts characters. Do not use it to count lines: `readAllLines().size()` or a `BufferedReader` says that directly.

### BufferedReader

Wraps another reader and adds `readLine()`. That method returns `null` at end of file, and the null is the loop condition:

```java
String line;
while ((line = reader.readLine()) != null) {
    // one line, terminator stripped
}
```

A loop that ignores the null spins forever on the last line. `Files.newBufferedReader(path)` decodes UTF-8 and returns a `BufferedReader`, so one try-with-resources line covers opening, charset, and closing.

### Scanner

`Scanner` splits on a delimiter, whitespace by default, and converts tokens with `nextInt`, `nextDouble`, `next`. Good for a file of numbers. Clumsy for CSV, because a comma is not whitespace. Also remember that `nextInt` leaves the rest of the line in the buffer, so a following `nextLine` often returns an empty string. `Scanner` is slower than `BufferedReader`, and that rarely matters on exam input.

### Files.write and Files.writeString

`Files.write(path, lines)` writes an `Iterable` of `CharSequence` and appends the platform line separator after every element, including the last. With no options it behaves as `CREATE`, `TRUNCATE_EXISTING`, `WRITE`: an existing file is replaced. Add `StandardOpenOption.APPEND` together with `CREATE` to keep old content and add at the end.

`Files.writeString(path, text)` is the same idea for one `String`, available since Java 11. It also replaces by default. The charset overload sits before the options: `Files.writeString(path, text, StandardCharsets.UTF_8, StandardOpenOption.APPEND)`.

### BufferedWriter

Buffers characters and adds `newLine()`, which writes the platform separator. Wrap it in a `PrintWriter` when you want `println` and `printf`. Call `flush()` before reading the same file back in the same run, or close the writer first; try-with-resources closes at the end of the block, so put the reading after the block.

### Charset

`StandardCharsets.UTF_8` is the default worth writing explicitly. The overloads that matter are `readAllLines(path, charset)`, `readString(path, charset)`, `write(path, lines, charset, options)`, `writeString(path, text, charset, options)`, `newBufferedReader(path, charset)`, and `newBufferedWriter(path, charset, options)`. Read and write with the same charset. A mismatch does not throw; it produces broken text.

### Bytes

Text methods decode. For an image, a zip, or a PDF, use `Files.readAllBytes` and `Files.write` with a `byte[]`. A charset does not apply to those. `Files.size(path)` gives the length in bytes, and `Files.copy(from, to)` copies content without decoding it. Reading a binary file with `readAllLines` does not fail loudly; it produces replacement characters and a list that has nothing to do with the original bytes.

`Files.mismatch(first, second)` returns the position of the first differing byte, or -1 when the files match. That is a one line check after a copy, on Java 12 and later.

### Directories

`Files.createDirectories(path)` creates every missing parent and returns quietly if the directory already exists. `Files.createDirectory` fails when the parent is missing, so it is the wrong call for `out/2026/report.txt`. `Files.exists(path)` is the check you want before reading. Do not treat `!Files.exists` as proof the file is writable; a permission problem only appears when you open it.

`Files.list(dir)` returns a `Stream<Path>` of one level, and the stream must be closed. `Files.walk(dir)` goes deeper and also must be closed. `Files.delete(path)` removes an empty directory or a file; `Files.deleteIfExists` is safe to repeat.

### Copy, move, delete

`Files.copy(from, to)` refuses to overwrite unless you pass `StandardCopyOption.REPLACE_EXISTING`. It copies content, not the file attributes, unless you ask for them. `Files.move(from, to)` is a rename on the same disk and a copy plus delete across disks. `Files.delete` removes one file or one empty directory. Deleting a tree means walking it and deleting children first.

### try-with-resources

One `try` can open several resources, and they close in reverse order. A failure inside `close()` becomes a suppressed exception on the exception that caused the exit, which is why a stack trace sometimes shows a `Suppressed:` block. The resource variable is out of scope after the block, so the read that needs the file back has to sit after it.

Anything `AutoCloseable` works: `BufferedReader`, `BufferedWriter`, `Scanner`, the `Stream<Path>` from `Files.list`, and the `Stream<String>` from `Files.lines`. Two resources in one line read well:

```java
try (BufferedReader in = Files.newBufferedReader(source, StandardCharsets.UTF_8);
     BufferedWriter out = Files.newBufferedWriter(target, StandardCharsets.UTF_8)) {
    // out closes first, then in, because close runs in reverse order
}
```

Do not put `Scanner` on `System.in` in a try-with-resources block. Closing it closes the keyboard stream for the rest of the program.

### Exceptions

`IOException` is checked. `throws IOException` on `main` is acceptable in a console exam: the JVM prints a stack trace that names the missing file or the denied path. The common failures are `NoSuchFileException` (NIO) and `FileNotFoundException` (java.io) for a missing input, `FileAlreadyExistsException` from `createDirectory`, `AccessDeniedException` for permissions, and `FileSystemException` when a directory is used where a file is expected.

## Examples

### Example 1: Three ways to read the same settings file

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class ReadSettings {

    public static void main(String[] args) throws IOException {
        Path file = Path.of("settings.txt");

        // 1. Whole file, one element per line.
        List<String> lines = Files.readAllLines(file, StandardCharsets.UTF_8);
        System.out.println("lines: " + lines.size());

        // 2. Whole file as one string, newlines kept.
        String text = Files.readString(file, StandardCharsets.UTF_8);
        System.out.println("chars: " + text.length());

        // 3. Line by line. Memory stays flat no matter how big the file is.
        int count = 0;
        try (BufferedReader reader = Files.newBufferedReader(file, StandardCharsets.UTF_8)) {
            String line;
            while ((line = reader.readLine()) != null) {
                count++;
            }
        }
        System.out.println("counted: " + count);
    }
}
```

The loop condition does two things: it assigns the next line and it tests that the line is not null. Write that from memory until it is automatic.

### Example 2: Sum numbers from a file and survive junk rows

Data file `numbers.txt`:

```text
12
7

not a number
30
```

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class SumNumbers {

    public static void main(String[] args) throws IOException {
        List<String> lines = Files.readAllLines(Path.of("numbers.txt"));
        int sum = 0;
        int skipped = 0;

        for (String raw : lines) {
            String line = raw.trim();
            if (line.isEmpty()) {
                continue;                 // blank line, not an error
            }
            try {
                sum += Integer.parseInt(line);
            } catch (NumberFormatException e) {
                skipped++;                // one bad row must not lose the rest
            }
        }

        System.out.println("sum=" + sum + " skipped=" + skipped);
    }
}
```

A try around the whole loop would stop at the first bad line and discard every result after it. Per line recovery reports the same totals and keeps going.

### Example 3: Create the folder, write, then append

```java
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.List;

public class AppendReport {

    public static void main(String[] args) throws IOException {
        Path out = Path.of("out", "report.txt");

        // Without this, both writes below fail when out/ does not exist yet.
        Files.createDirectories(out.getParent());

        // First write replaces any old file.
        Files.writeString(out, "report v1\n", StandardCharsets.UTF_8);

        // Later writes append. CREATE covers the first run, APPEND keeps the text.
        Files.write(out, List.of("row 1", "row 2"), StandardCharsets.UTF_8,
                StandardOpenOption.CREATE, StandardOpenOption.APPEND);

        // Same job with a writer, useful when the rows are generated in a loop.
        try (BufferedWriter writer = Files.newBufferedWriter(out, StandardCharsets.UTF_8,
                StandardOpenOption.CREATE, StandardOpenOption.APPEND)) {
            writer.write("row 3");
            writer.newLine();
        }

        // The writer is closed here, so this read sees all four lines.
        System.out.println(Files.readString(out, StandardCharsets.UTF_8));
    }
}
```

`CREATE` with `APPEND` is the pair to remember. `APPEND` alone fails with `NoSuchFileException` when the file does not exist yet, and a write without `APPEND` deletes the old content.

### Example 4: Scanner over a file of tokens

Data file `scores.txt`:

```text
8.5 7 9.5 6
10
```

```java
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.Scanner;

public class AverageScore {

    public static void main(String[] args) throws IOException {
        // Scanner is Closeable, so try-with-resources works on it.
        try (Scanner scanner = new Scanner(Path.of("scores.txt"), StandardCharsets.UTF_8)) {
            double sum = 0;
            int count = 0;

            // hasNextDouble stops at a word instead of throwing mid loop.
            while (scanner.hasNextDouble()) {
                sum += scanner.nextDouble();
                count++;
            }

            System.out.println(count == 0 ? "no scores" : "avg=" + (sum / count));
        }
    }
}
```

If the file has a header or a name before the numbers, stop using `Scanner` for the whole file. Read lines and split them, because `hasNextDouble` would stop at the first word and return zero scores.

### Example 5: Occupancy report, read to write

The input is pipe separated, with a header. This one program contains the whole exam pattern: header lookup, line loop, per line recovery, aggregation, folder creation, buffered output, and a read back for the console.

Data file `rooms.txt`:

```text
room_id|city|beds|occupied
101|Budapest|2|yes
102|Budapest|2|no
201|Szeged|3|yes
202|Szeged|1|no
203|Szeged|4|yes
```

```java
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.LinkedHashMap;
import java.util.Map;

public class OccupancyReport {

    public static void main(String[] args) throws IOException {
        Path input = Path.of("rooms.txt");
        Path output = Path.of("out", "occupancy.txt");

        if (!Files.exists(input)) {
            System.out.println("Missing input: " + input.toAbsolutePath());
            return;
        }

        Map<String, Integer> index = new LinkedHashMap<>();
        Map<String, int[]> totals = new LinkedHashMap<>();   // city -> {rooms, occupied}

        try (BufferedReader reader = Files.newBufferedReader(input, StandardCharsets.UTF_8)) {
            String headerLine = reader.readLine();
            if (headerLine == null) {
                System.out.println("Empty file");
                return;
            }

            // A UTF-8 file saved by some Windows editors starts with a byte order mark.
            if (headerLine.startsWith("\uFEFF")) {
                headerLine = headerLine.substring(1);
            }

            String[] header = headerLine.split("\\|", -1);
            for (int i = 0; i < header.length; i++) {
                index.put(header[i].trim().toLowerCase(), i);
            }

            // Column order is not trusted. Missing names stop the program with a message.
            if (index.get("city") == null || index.get("occupied") == null) {
                System.out.println("Header needs city and occupied");
                return;
            }

            String line;
            int lineNumber = 1;              // the header was line 1
            while ((line = reader.readLine()) != null) {
                lineNumber++;
                if (line.isBlank()) {
                    continue;
                }

                String[] parts = line.split("\\|", -1);
                if (parts.length != header.length) {
                    System.out.println("line " + lineNumber + ": " + parts.length + " fields");
                    continue;                // skip the row, keep the report
                }

                String city = parts[index.get("city")].trim();
                boolean occupied = parts[index.get("occupied")].trim().equalsIgnoreCase("yes");

                int[] row = totals.computeIfAbsent(city, key -> new int[2]);
                row[0]++;
                if (occupied) {
                    row[1]++;
                }
            }
        }

        Files.createDirectories(output.getParent());

        try (BufferedWriter writer = Files.newBufferedWriter(output, StandardCharsets.UTF_8,
                StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING)) {
            writer.write("Occupancy report");
            writer.newLine();

            for (Map.Entry<String, int[]> entry : totals.entrySet()) {
                int rooms = entry.getValue()[0];
                int used = entry.getValue()[1];
                double rate = 100.0 * used / rooms;
                writer.write(String.format("%-12s %3d rooms %3d used %6.1f%%",
                        entry.getKey(), rooms, used, rate));
                writer.newLine();
            }
        }

        System.out.println(Files.readString(output, StandardCharsets.UTF_8));
    }
}
```

Read the program in three blocks. The first block opens the file and learns where the columns are. The second block loops, validates the field count, and accumulates into a map. The third block writes the file after closing the input, which keeps at most one handle open.

`computeIfAbsent` creates the counter array on first use, so the loop has no containsKey branch. `TRUNCATE_EXISTING` is explicit because the report is a snapshot, not a log. `%%` prints a literal percent sign in `String.format`.

### Example 6: Copy the CSV files from a folder

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class CopyCsvFiles {

    public static void main(String[] args) throws IOException {
        Path source = Path.of("inbox");
        Path target = Path.of("out", "csv");

        if (!Files.isDirectory(source)) {
            System.out.println("Not a folder: " + source.toAbsolutePath());
            return;
        }
        Files.createDirectories(target);

        // Collect first, so the directory stream is closed before the copy loop.
        List<Path> csv;
        try (Stream<Path> files = Files.list(source)) {
            csv = files
                    .filter(p -> p.getFileName().toString().toLowerCase().endsWith(".csv"))
                    .collect(Collectors.toList());
        }

        int copied = 0;
        for (Path file : csv) {
            Path dest = target.resolve(file.getFileName());
            Files.copy(file, dest, StandardCopyOption.REPLACE_EXISTING);
            copied++;
        }

        System.out.println("copied " + copied + " file(s) into " + target.toAbsolutePath());
    }
}
```

`Files.list` gives one level, not a tree; use `Files.walk` when the CSV files sit in subfolders. `target.resolve(file.getFileName())` keeps the name and changes the folder. The copy loop runs outside the stream block because `Files.copy` throws `IOException` and a lambda inside `forEach` cannot pass a checked exception up without a wrapper.

## More examples

### Example 7: Choose between readString and readAllLines

Both calls load the file into memory, so both are wrong for a log that does not fit. The choice between them is about the shape of the answer, not about speed.

```java
// File: PickReadCall.java
// Data shape: Path -> either one String or List<String>, chosen by byte size
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class PickReadCall {

    static final long SMALL = 1_000_000;   // 1 MB, a made up but safe ceiling

    public static void main(String[] args) throws IOException {
        Path file = Path.of("template.html");
        Files.writeString(file, "<h1>Report</h1>\n<p>ready</p>\n", StandardCharsets.UTF_8);

        long bytes = Files.size(file);

        if (bytes < SMALL) {
            // One String, newlines kept. Same charset on both sides of the round trip.
            String text = Files.readString(file, StandardCharsets.UTF_8);
            System.out.println("string mode, " + text.length() + " chars");
            System.out.println(text.lines().count() + " logical line(s)");
        } else {
            // One element per line, terminators removed. The list is mutable.
            List<String> lines = Files.readAllLines(file, StandardCharsets.UTF_8);
            lines.removeIf(String::isBlank);
            System.out.println("list mode, " + lines.size() + " line(s)");
        }
    }
}
```

`Files.size` returns bytes, not characters. For ASCII text the two counts agree; for accented UTF-8 text one character can take two bytes, so a byte limit is the conservative one. `String.lines()` splits on any line break and drops the trailing empty element, which matches what `readAllLines` gives you.

### Example 8: One pass with BufferedReader

`readAllLines` builds a list. When the question is only a count, a maximum, or a first match, that list is wasted memory. This loop keeps one line at a time.

`notes.txt`:

```text
first line
second line

fourth line, the longest one here
```

```java
// File: LineStats.java
// Data shape: text file -> {lines, blanks, longest} in one pass
import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

public class LineStats {

    public static void main(String[] args) throws IOException {
        Path input = Path.of("notes.txt");

        if (!Files.isRegularFile(input)) {
            System.out.println("No file at " + input.toAbsolutePath());
            return;
        }

        int lines = 0;
        int blanks = 0;
        String longest = "";

        // One pass, flat memory. readLine strips \n, \r\n and \r.
        try (BufferedReader reader = Files.newBufferedReader(input, StandardCharsets.UTF_8)) {
            String line;
            while ((line = reader.readLine()) != null) {
                lines++;
                if (line.isBlank()) {
                    blanks++;
                }
                if (line.length() > longest.length()) {
                    longest = line;
                }
            }
        }

        System.out.printf("lines=%d blanks=%d longest=%d%n", lines, blanks, longest.length());
        System.out.println("first char of longest: " + (longest.isEmpty() ? "-" : longest.charAt(0)));
    }
}
```

`longest` starts empty, so the first line always wins the first comparison. Counting blank lines separately stops a blank line from becoming the longest one, and it is the number a report usually needs anyway. The read block opens and closes the file; nothing after it can use the reader.

### Example 9: Bytes, not text

A PNG, a zip, or a PDF has no lines and no charset. Passing it through `readAllLines` does not throw; it returns nonsense. The byte APIs keep the content untouched.

```java
// File: BinaryCopy.java
// Data shape: byte[] payload -> file; two paths -> first differing byte, or -1
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

public class BinaryCopy {

    public static void main(String[] args) throws IOException {
        Path original = Path.of("logo.bin");
        Path copy = Path.of("backup", "logo.bin");

        // Bytes are opaque here. No charset, no line splitting, no decoding.
        byte[] payload = {(byte) 0x89, 'P', 'N', 'G', 0, 1, 2, (byte) 0xFF};
        Files.createDirectories(copy.getParent());
        Files.write(original, payload);

        Files.copy(original, copy, StandardCopyOption.REPLACE_EXISTING);

        long size = Files.size(copy);
        long diff = Files.mismatch(original, copy);   // -1 means identical
        System.out.println("size=" + size + " mismatch=" + diff);

        if (diff != -1) {
            System.out.println("copy differs at byte " + diff);
        }
    }
}
```

`Files.write` with a `byte[]` replaces the file, exactly like the text overload. `Files.mismatch` returns -1 when the files match and the index of the first difference otherwise, which is a better check than comparing sizes. The cast `(byte) 0x89` is needed because Java bytes are signed and 0x89 is 137, outside the byte range.

### Example 10: Walk a folder tree

`Files.list` reads one level. A report over a tree needs `Files.walk`, and that stream holds a directory handle until it closes.

```java
// File: TreeReport.java
// Data shape: directory -> Map<folder, {files, bytes}> for .txt files, any depth
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Stream;

public class TreeReport {

    public static void main(String[] args) throws IOException {
        Path root = Path.of("data");

        // Build a small tree so the program runs on an empty folder too.
        Files.createDirectories(root.resolve("2025"));
        Files.createDirectories(root.resolve("2026").resolve("q1"));
        Files.writeString(root.resolve("readme.txt"), "index\n");
        Files.writeString(root.resolve("2025").resolve("jan.txt"), "cold\n");
        Files.writeString(root.resolve("2026").resolve("q1").resolve("mar.txt"), "wind\n");
        Files.writeString(root.resolve("2026").resolve("skip.csv"), "a,b\n");

        Map<String, long[]> perFolder = new TreeMap<>();   // folder -> {count, bytes}

        // walk goes to any depth and includes the root itself.
        try (Stream<Path> paths = Files.walk(root)) {
            paths.filter(Files::isRegularFile)
                 .filter(p -> p.getFileName().toString().endsWith(".txt"))
                 .forEach(p -> {
                     String folder = root.relativize(p.getParent()).toString();
                     if (folder.isEmpty()) {
                         folder = ".";
                     }
                     long[] row = perFolder.computeIfAbsent(folder, key -> new long[2]);
                     row[0]++;
                     try {
                         row[1] += Files.size(p);
                     } catch (IOException e) {
                         // Size is decoration here, the count still matters.
                         System.out.println("size failed for " + p + ": " + e.getMessage());
                     }
                 });
        }

        perFolder.forEach((folder, row) ->
                System.out.printf("%-8s %2d file(s) %5d bytes%n", folder, row[0], row[1]));
    }
}
```

`root.relativize(p.getParent())` turns an absolute or nested path into `2026/q1`, which is the part a report should show. A `TreeMap` sorts the folders without a second sort call. The size lookup needs its own try because a lambda cannot pass a checked `IOException` to the surrounding `main`.

`Files.walk(root, 2)` limits the depth: 1 is the root's children, 2 adds grandchildren. Do not delete files inside the stream that produced them; collect the paths first, then act.

### Example 11: Publish through a temp file

Writing the final report in place means a crash halfway leaves a truncated file. Write a temp file beside the target, then move it over the target in one step.

```java
// File: PublishFile.java
// Data shape: staging Path -> final Path in one move, plus one audit line per run
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.nio.file.StandardOpenOption;

public class PublishFile {

    public static void main(String[] args) throws IOException {
        Path outDir = Path.of("out");
        Files.createDirectories(outDir);
        Path target = outDir.resolve("report.txt");
        Path log = outDir.resolve("publish.log");

        // Temp file in the same folder, so the move stays on one filesystem.
        Path staging = Files.createTempFile(outDir, "report-", ".tmp");
        try {
            Files.writeString(staging, "rows=3\n", StandardCharsets.UTF_8);
            Files.move(staging, target,
                    StandardCopyOption.REPLACE_EXISTING,
                    StandardCopyOption.ATOMIC_MOVE);
        } finally {
            // After a successful move there is nothing to delete, and this is harmless.
            Files.deleteIfExists(staging);
        }

        // Append one line per run. CREATE covers the very first run.
        Files.writeString(log, "published " + target.getFileName() + "\n",
                StandardCharsets.UTF_8,
                StandardOpenOption.CREATE, StandardOpenOption.APPEND);

        System.out.println(Files.readString(target, StandardCharsets.UTF_8).trim());
        System.out.println("log lines: " + Files.readAllLines(log, StandardCharsets.UTF_8).size());
    }
}
```

`createTempFile` generates a unique name, so two runs cannot collide. Putting it in `out` keeps the later move on one filesystem, where it is a rename instead of a copy and delete. `ATOMIC_MOVE` asks for that rename as a single step; a filesystem that cannot do it throws `AtomicMoveNotSupportedException`, so drop the option if the exam machine complains. The `finally` covers the failed path, and `deleteIfExists` stays quiet when the move already consumed the temp file.

### Example 12: File attributes in one snapshot

`Files.exists` answers one question. A report needs several, and `readAttributes` returns them together.

```java
// File: FileFacts.java
// Data shape: Path -> one attribute snapshot {size, type, timestamps, flags}
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.BasicFileAttributes;
import java.nio.file.attribute.FileTime;
import java.time.Instant;

public class FileFacts {

    public static void main(String[] args) throws IOException {
        Path file = Path.of("facts.txt");
        Files.writeString(file, "hello\n");

        // One call, one snapshot. Cheaper and more consistent than four probes.
        BasicFileAttributes attrs = Files.readAttributes(file, BasicFileAttributes.class);

        System.out.println("name       " + file.getFileName());
        System.out.println("size       " + attrs.size() + " bytes");
        System.out.println("directory  " + attrs.isDirectory());
        System.out.println("regular    " + attrs.isRegularFile());

        FileTime modified = attrs.lastModifiedTime();
        System.out.println("modified   " + modified.toInstant());
        System.out.println("age secs   "
                + (Instant.now().getEpochSecond() - modified.toInstant().getEpochSecond()));

        // exists follows links. None of these prove the next write will succeed.
        System.out.println("readable   " + Files.isReadable(file));
        System.out.println("writable   " + Files.isWritable(file));
        System.out.println("exists     " + Files.exists(file));
    }
}
```

`attrs.size()` on a directory is not the sum of its contents; it is a number the filesystem reports and it differs between platforms. `lastModifiedTime` returns a `FileTime`, and `toInstant()` is the bridge to `java.time`. The three `Files.is...` calls repeat the path lookup; the attributes object already answers size and type, but it holds no permission bits. On Linux those come from `PosixFileAttributes`, on Windows from an `AclFileAttributeView`, so an answer that only needs size and dates should stay with `BasicFileAttributes`.

### Example 13: Rewrite a file through two resources

A conversion reads one file and writes another. Both belong in the same `try`, so the writer flushes before the read that follows.

```java
// File: RewriteCsv.java
// Data shape: pipe separated rows in -> comma separated rows out, blank rows dropped
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

public class RewriteCsv {

    public static void main(String[] args) throws IOException {
        Path input = Path.of("rooms.psv");
        Path output = Path.of("out", "rooms.csv");

        if (!Files.exists(input)) {
            Files.writeString(input, "room_id|city|beds\n101|Budapest|2\n\n102|Szeged|3\n");
        }
        Files.createDirectories(output.getParent());

        int written = 0;

        // Two resources, one try. The writer closes first, the reader last.
        try (BufferedReader reader = Files.newBufferedReader(input, StandardCharsets.UTF_8);
             BufferedWriter writer = Files.newBufferedWriter(output, StandardCharsets.UTF_8,
                     StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING)) {

            String line;
            while ((line = reader.readLine()) != null) {
                if (line.isBlank()) {
                    continue;               // an empty row, not a one field row
                }
                String[] fields = line.split("\\|", -1);
                writer.write(String.join(",", fields));
                writer.newLine();           // platform line separator
                written++;
            }
        }

        System.out.println("wrote " + written + " row(s)");
        System.out.println(Files.readString(output, StandardCharsets.UTF_8));
    }
}
```

Closing order is reverse of declaration: the writer closes first, so its buffer reaches the disk before anything reads the output. `newLine()` writes the platform separator, which is why the same program produces CRLF on Windows and LF on Linux. If the task compares output byte for byte, write `"\n"` explicitly instead.

Two edge cases are missing on purpose. A quoted field that contains a comma survives this conversion only because the input separator is a pipe; a real CSV to CSV rewrite needs the quoted field parser from the command reference.

### Example 14: Scanner with your own delimiter

`Scanner` splits on whitespace by default. A config file needs a different pattern, and the pattern is one call.

```java
// File: ReadConfig.java
// Data shape: "key=value;" pairs -> Map<String, String>, file order kept
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Scanner;

public class ReadConfig {

    public static void main(String[] args) throws IOException {
        Path file = Path.of("app.conf");
        Files.writeString(file, "host=localhost;port=8080;mode=test;\n");

        Map<String, String> config = new LinkedHashMap<>();

        // useDelimiter replaces the whitespace default. The regex splits on ; and line breaks.
        try (Scanner scanner = new Scanner(file, StandardCharsets.UTF_8)
                .useDelimiter("[;\\r\\n]+")) {
            while (scanner.hasNext()) {
                String pair = scanner.next().trim();
                if (pair.isEmpty() || pair.startsWith("#")) {
                    continue;
                }
                int split = pair.indexOf('=');
                if (split <= 0) {
                    System.out.println("bad pair: " + pair);
                    continue;
                }
                config.put(pair.substring(0, split), pair.substring(split + 1));
            }
        }

        for (Map.Entry<String, String> entry : config.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue());
        }
    }
}
```

`hasNext` and `next` work on tokens, so the newline after the last pair produces no empty token once the delimiter class covers it. `LinkedHashMap` keeps the file order, which makes a printed config readable. The `split <= 0` test rejects both a missing `=` and a line that starts with one, and the loop continues instead of ending the parse.

## Common mistakes

- `new FileReader("file.txt")` without a charset. Accented text breaks on a machine whose default is not UTF-8.
- Reading with `BufferedReader` and forgetting the null test. The loop either throws a `NullPointerException` on the line handling or never ends.
- Assuming `Files.write` appends. It replaces, and the old content is gone before you notice.
- Writing into `out/report.txt` before creating `out/`. The write throws `NoSuchFileException` on the parent.
- Leaving a `BufferedReader`, `BufferedWriter`, or `Files.lines` stream unclosed. Files stay locked, and on Windows the next write can fail.
- Using `Files.list` without closing the stream. It holds a directory handle open.
- Comparing lines with `==` instead of `equals`. Two identical strings can be different objects.
- Calling `readAllLines` on a multi-gigabyte file. The task wanted a sum, not a list.
- Forgetting to skip the header, or skipping the first data row by using the wrong start index.
- Parsing a field without `trim()`. A trailing space makes `parseInt` throw or makes a city appear twice.
- Believing the working directory is the source folder. It is wherever the program was started.
- Merging `Scanner` tokens and `nextLine` in one loop. The leftover newline produces an empty line.
- Catching `IOException` in an empty block. The program then reports zero rows and no reason.
- Reading a PNG or a jar with a text API. `readAllLines` decodes bytes and gives nonsense.
- Assuming the last line ends with a newline. When appending, check or add one, or two records merge.
- Building paths with `File.separator` and string concatenation. `Path.of` and `resolve` already do it.

## Exam checklist

- Can you write `Files.readAllLines(Path.of(...))` and the `BufferedReader` loop from memory, without looking?
- Do you know which calls replace a file and which append, and the option pair that appends safely?
- Is every reader, writer, scanner, and stream in a try-with-resources?
- Does every file open pass `StandardCharsets.UTF_8`, or use a `Files` method that already does?
- Does the program create the output directory before the first write?
- Does the line loop handle a header, blank lines, and a wrong field count without crashing?
- Does a missing input file produce a readable message instead of a stack trace in the middle of the report?
- Can you explain what `readLine` returns at end of file, and why the assignment sits inside the condition?
- Can you point to the one place that would change if the input charset were Cp1250?
- Does the program still compile after a column is added to the end of the file?

