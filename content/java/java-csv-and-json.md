---
id: java-csv-and-json
lang: Java
title: CSV and JSON in Java
---

# CSV and JSON in Java

## Simplest form

```java
// Data shape: "a,b,," -> {"a", "b", "", ""}; without -1 the trailing empties vanish
String[] fields = line.split(",", -1);
```

Without the `-1`, `"a,b,,".split(",")` returns two elements and both empty fields disappear. Every index after them then points at the wrong column.

## What it does

CSV has no class in the JDK and no single standard. The common shape, written down in RFC 4180, is comma separated fields, an optional header row, quotes around fields that contain a comma or a newline, and a doubled quote inside a quoted field. You either split, which is enough for exam data, or write a small parser for quotes. JSON also has no JDK parser. For a fixed, small object you can build the text with a `StringBuilder`. For anything that has to be read back, add Jackson.

## Every part

### split and the limit argument

`split(",", -1)` keeps trailing empty strings. `split(",")` removes them, so the array length changes with the data and `parts[4]` can throw `ArrayIndexOutOfBoundsException` on one row only.

The argument is a regular expression. Use `split("\\|")` for pipes, `split(";")` for semicolons, `split("\\t")` for tabs. `split(".")` splits between every character, because the dot matches any character; escape it as `"\\."`.

A quoted field with a comma inside, `"Kovacs, Anna"`, defeats `split` completely. The comma inside the quotes is treated as a separator, and the quote characters stay in the values. If the data has quoted fields, use the parser below.

Trim after splitting, because spaces around separators are common in hand written files. Do not trim inside a quoted field: those spaces may be part of the value.

### Header detection

Read the first line, split it, trim each name, lowercase it, and store name to index in a map. From then on use `col.get("city")` instead of `parts[3]`. A column inserted in the middle then changes nothing.

Watch three details. A UTF-8 file saved on Windows can start with `\uFEFF`, the byte order mark, which sticks to the first header name and breaks the lookup. Header names differ between tasks: `email` in one file, `customer_email` in another, `E-mail` in a third. Compare lowercased names, and check for the columns you need before the loop, not inside it.

Also decide what a missing header means. `lines.isEmpty()` covers an empty file. `lines.size() == 1` means a header with no data, which is a valid report with zero rows, not an error.

### Quoted fields

A field needs quotes when it contains a comma, a double quote, `\n`, or `\r`. Inside the quotes, a double quote is written twice. The value `He said "hi"` becomes `"He said ""hi"""`.

Reading that with `split` cannot work. A small loop over the characters can: track whether you are inside quotes, treat a comma outside quotes as a separator, and turn `""` into one quote. That parser is about twenty lines and fits in an exam answer.

Writing needs the reverse. Quote the value when it contains one of the four characters, and double every quote inside. A row that is never quoted looks fine until a city name contains a comma and the next program reads one extra column.

### Types

Fields arrive as `String`. Convert with `Integer.parseInt`, `Double.parseDouble`, `LocalDate.parse`, and catch `NumberFormatException` or `DateTimeParseException` per row so one bad line does not kill the file.

An empty numeric field is not zero unless the task says so. Decide once: skip the row, use a default, or report it. For money, `double` loses cents on long sums; use `BigDecimal` when the task mentions prices or totals that must match to the cent.

### JSON without a library

The grammar is small. Objects use `{}` with `"key": value` pairs, arrays use `[]`, strings use double quotes, and the scalars are numbers, `true`, `false`, and `null`. There is no trailing comma before a closing bracket. Keys are always quoted.

Building JSON means escaping every string: backslash becomes `\\`, quote becomes `\"`, newline becomes `\n`, tab becomes `\t`, and control characters below 0x20 become `\u00XX`. Numbers and booleans are appended without quotes. A null reference must become `null`, not the text `"null"`.

Reading JSON by hand is a different matter. For one known flat object you can find a key with `indexOf`, take the text between the following quotes or digits, and stop. It breaks the moment the document nests, escapes a quote, or reorders keys. If the program must read JSON that it did not write, use Jackson.

### Jackson

Jackson lives in three jars: `jackson-databind`, `jackson-core`, `jackson-annotations`. Compile and run with all three on the classpath:

```bash
javac -cp jackson-databind-2.x.jar BookingJson.java
java -cp .:jackson-databind-2.x.jar:jackson-core-2.x.jar:jackson-annotations-2.x.jar BookingJson
```

On Windows the separator is `;`. If the exam machine has no Jackson jar, fall back to the manual writer and keep the data flat.

`ObjectMapper` does the work. `readValue(json, Customer.class)` fills an object, `readValue(json, new TypeReference<List<Customer>>() {})` fills a list, `readTree(json)` returns a `JsonNode` tree for unknown shapes, and `writeValueAsString` produces compact JSON. `writerWithDefaultPrettyPrinter()` adds indentation.

Two defaults surprise people. Unknown properties throw unless you call `mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)` or annotate the class with `@JsonIgnoreProperties(ignoreUnknown = true)`. And `LocalDate` fields need the `jackson-datatype-jsr310` module registered, otherwise serialization throws `InvalidDefinitionException` and asks for that module. Keeping dates as `String` in the DTO avoids the extra jar for an exam.

Configure one `ObjectMapper`, keep it in a field, and reuse it. It is thread safe after configuration, and creating one per row is slow.

## Examples

### Example 1: Split one line and show where the empty field went

```java
import java.util.Arrays;

public class SplitDemo {

    public static void main(String[] args) {
        String line = "101,Budapest,2,";

        String[] withoutLimit = line.split(",");
        String[] withLimit = line.split(",", -1);

        System.out.println(withoutLimit.length);   // 3, the empty last field is gone
        System.out.println(withLimit.length);      // 4, the empty last field stays
        System.out.println(Arrays.toString(withLimit));
        System.out.println("last=[" + withLimit[3] + "]");   // last=[]

        // An empty field in the middle survives either way.
        String middle = "anna@example.com,Kovacs,Anna,,1998-05-12";
        System.out.println(middle.split(",").length);   // 5
    }
}
```

The last field of the first line is empty. `split(",")` drops it, so the array has three elements and `parts[3]` is out of range. The second line shows the other half of the rule: an empty field between two values survives with or without the limit. Only trailing empty fields are removed.

### Example 2: Header by name, then typed rows

Data file `customers.csv`:

```text
customer_email,first_name,last_name,phone,birthday
anna@example.com,Kovacs,Anna,,1998-05-12
ben@example.com,Nagy,Ben,+3612345678,2001-02-28
cara@example.com,Toth,Cara,,1995-11-03
```

```java
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ReadCustomers {

    record Customer(String customer_email, String first_name, String last_name,
                    String phone, String birthday) {
    }

    public static void main(String[] args) throws IOException {
        List<String> lines = Files.readAllLines(Path.of("customers.csv"), StandardCharsets.UTF_8);

        if (lines.size() < 2) {
            System.out.println("no data rows");
            return;
        }

        String[] header = lines.get(0).split(",", -1);
        Map<String, Integer> col = new HashMap<>();
        for (int i = 0; i < header.length; i++) {
            // putIfAbsent keeps the first column when a name repeats
            col.putIfAbsent(header[i].trim().toLowerCase(), i);
        }

        for (String name : List.of("customer_email", "first_name", "last_name",
                "phone", "birthday")) {
            if (!col.containsKey(name)) {
                System.out.println("missing column: " + name);
                return;
            }
        }

        List<Customer> customers = new ArrayList<>();

        for (int i = 1; i < lines.size(); i++) {
            String line = lines.get(i);
            if (line.isBlank()) {
                continue;
            }

            String[] f = line.split(",", -1);
            if (f.length != header.length) {
                System.out.println("row " + (i + 1) + ": " + f.length + " fields, skipped");
                continue;
            }

            customers.add(new Customer(
                    f[col.get("customer_email")].trim(),
                    f[col.get("first_name")].trim(),
                    f[col.get("last_name")].trim(),
                    f[col.get("phone")].trim(),
                    f[col.get("birthday")].trim()));
        }

        System.out.println("loaded: " + customers.size());
        for (Customer c : customers) {
            System.out.println(c.first_name() + " " + c.last_name() + " <" + c.customer_email() + ">");
        }
    }
}
```

The header map costs five lines and saves the program when the columns are reordered. The field count check is the second guard: a stray comma in the data produces a row with one extra field, and that row is skipped instead of shifting values into the wrong record.

### Example 3: A quoted field parser and a quoting writer

This data has a comma inside a name and doubled quotes inside a note:

```text
"Kovacs, Anna",Budapest,"He said ""hi""",42
```

```java
import java.util.ArrayList;
import java.util.List;

public class CsvQuote {

    // Turns one CSV line into fields. Handles quotes and doubled quotes.
    static List<String> parseCsvLine(String line) {
        List<String> fields = new ArrayList<>();
        StringBuilder field = new StringBuilder();
        boolean quoted = false;

        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);

            if (quoted) {
                if (c == '"') {
                    if (i + 1 < line.length() && line.charAt(i + 1) == '"') {
                        field.append('"');   // "" inside quotes is one quote
                        i++;
                    } else {
                        quoted = false;      // closing quote
                    }
                } else {
                    field.append(c);          // comma inside quotes is text
                }
            } else if (c == '"') {
                quoted = true;                // opening quote is not stored
            } else if (c == ',') {
                fields.add(field.toString());
                field.setLength(0);
            } else {
                field.append(c);
            }
        }

        fields.add(field.toString());          // last field, even when empty
        return fields;
    }

    // Quotes a value only when the output would be ambiguous without it.
    static String csvField(String value) {
        if (value == null) {
            return "";
        }
        boolean needsQuotes = value.contains(",") || value.contains("\"")
                || value.contains("\n") || value.contains("\r");
        return needsQuotes ? "\"" + value.replace("\"", "\"\"") + "\"" : value;
    }

    public static void main(String[] args) {
        String line = "\"Kovacs, Anna\",Budapest,\"He said \"\"hi\"\"\",42";

        List<String> fields = parseCsvLine(line);
        for (int i = 0; i < fields.size(); i++) {
            System.out.println(i + ": [" + fields.get(i) + "]");
        }
        // 0: [Kovacs, Anna]
        // 1: [Budapest]
        // 2: [He said "hi"]
        // 3: [42]

        // Round trip: rebuild the line and parse it again.
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < fields.size(); i++) {
            if (i > 0) {
                out.append(',');
            }
            out.append(csvField(fields.get(i)));
        }
        System.out.println(out);
        System.out.println(parseCsvLine(out.toString()));
    }
}
```

The parser assumes a quote at the start of a field opens quoting. A stray quote inside an unquoted value, like `12" screen`, is treated as an opening quote and consumes the rest of the line. Exam CSV rarely has that; if it does, check that the quote starts the field before switching modes.

### Example 4: JSON by hand, with escaping

```java
import java.time.LocalDate;

public class JsonByHand {

    // Everything that is not a number, true, false, or null goes through here.
    static String jsonString(String value) {
        if (value == null) {
            return "null";
        }
        StringBuilder b = new StringBuilder("\"");
        for (int i = 0; i < value.length(); i++) {
            char c = value.charAt(i);
            switch (c) {
                case '"':  b.append("\\\""); break;
                case '\\': b.append("\\\\"); break;
                case '\n': b.append("\\n");  break;
                case '\r': b.append("\\r");  break;
                case '\t': b.append("\\t");  break;
                default:
                    if (c < 0x20) {
                        b.append(String.format("\\u%04x", (int) c));
                    } else {
                        b.append(c);
                    }
            }
        }
        return b.append('"').toString();
    }

    public static void main(String[] args) {
        String city = "Budapest";
        String note = "Room \"deluxe\", 4th floor";
        int stars = 4;
        boolean open = true;
        Integer ownerId = null;

        StringBuilder json = new StringBuilder();
        json.append("{\n");
        json.append("  \"city\": ").append(jsonString(city)).append(",\n");
        json.append("  \"stars\": ").append(stars).append(",\n");
        json.append("  \"open\": ").append(open).append(",\n");
        json.append("  \"owner_id\": ").append(ownerId == null ? "null" : ownerId).append(",\n");
        json.append("  \"note\": ").append(jsonString(note)).append(",\n");
        json.append("  \"generated\": ").append(jsonString(LocalDate.now().toString())).append("\n");
        json.append("}");

        System.out.println(json);
        System.out.println(jsonString("back\\slash and tab\there"));
    }
}
```

Two traps are visible in the output. The note contains a quote and a comma, and both survive because the value is escaped. The owner id is `null` without quotes; printing `jsonString(String.valueOf(ownerId))` would produce the string `"null"`, which is a different value to every reader.

### Example 5: Jackson read and write

Requires the three jars on the classpath. File `hotel.json`:

```json
{
  "hotel_id": 10,
  "name": "Danube View",
  "city": "Budapest",
  "stars": 4,
  "owner_email": "owner@example.com"
}
```

```java
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.nio.file.Path;

public class HotelJson {

    record Hotel(int hotel_id, String name, String city, int stars, String owner_email) {
    }

    public static void main(String[] args) throws IOException {
        ObjectMapper mapper = new ObjectMapper();

        // 1. Straight into a record. Unknown fields are ignored here.
        mapper.configure(
                com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
                false);

        Hotel hotel = mapper.readValue(Path.of("hotel.json").toFile(), Hotel.class);
        System.out.println(hotel.name() + ", " + hotel.city() + ", " + hotel.stars() + " stars");

        // 2. Tree access when the shape is not known up front.
        JsonNode root = mapper.readTree(Path.of("hotel.json").toFile());
        String city = root.path("city").asText("unknown");
        int stars = root.path("stars").asInt(0);

        // path() returns a MissingNode, get() returns null. path() is safer in chains.
        String missing = root.path("description").asText("no description");
        System.out.println(city + " / " + stars + " / " + missing);

        // 3. Build a new object and write it.
        ObjectNode out = mapper.createObjectNode();
        out.put("city", city);
        out.put("stars", stars);
        out.put("checked", true);
        out.putArray("tags").add("sea view").add("breakfast");

        String json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(out);
        System.out.println(json);
    }
}
```

`readValue` with a `Path` needs `toFile()`; Jackson has no `Path` overload. The record works because Jackson 2.12 and later map record components by name.

### Example 6: Reservation CSV to a text report and a JSON report

Input file `bookings.csv`:

```text
reservation_id,customer_email,hotel_id,city,start_date,end_date,adults,children
R1,anna@example.com,10,Budapest,2026-07-01,2026-07-04,2,1
R2,ben@example.com,10,Budapest,2026-07-04,2026-07-06,1,0
R3,cara@example.com,20,Szeged,2026-08-10,2026-08-15,2,2
R4,dan@example.com,20,Szeged,2026-08-15,2026-08-15,2,0
R5,eva@example.com,20,Szeged,not-a-date,2026-08-20,1,0
```

Row R5 is broken on purpose. The program reports it, keeps the other four rows, writes `out/report.txt`, writes `out/report.json`, and prints both.

```java
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

public class BookingReport {

    // One valid data row after parsing. Strings stay strings, dates become LocalDate.
    record Booking(String email, String city, LocalDate start, LocalDate end,
                   int adults, int children) {
        long nights() {
            return ChronoUnit.DAYS.between(start, end);
        }

        int guests() {
            return adults + children;
        }
    }

    public static void main(String[] args) throws IOException {
        Path input = Path.of("bookings.csv");
        Path txt = Path.of("out", "report.txt");
        Path jsonFile = Path.of("out", "report.json");

        if (!Files.exists(input)) {
            System.out.println("Missing input: " + input.toAbsolutePath());
            return;
        }

        List<String> lines = Files.readAllLines(input, StandardCharsets.UTF_8);
        if (lines.size() < 2) {
            System.out.println("No data rows in " + input);
            return;
        }

        // 1. Header. The BOM check matters for files saved by Windows editors.
        String headerLine = lines.get(0);
        if (headerLine.startsWith("\uFEFF")) {
            headerLine = headerLine.substring(1);
        }
        String[] header = headerLine.split(",", -1);

        Map<String, Integer> col = new HashMap<>();
        for (int i = 0; i < header.length; i++) {
            col.putIfAbsent(header[i].trim().toLowerCase(), i);
        }

        for (String needed : List.of("customer_email", "city", "start_date",
                "end_date", "adults", "children")) {
            if (!col.containsKey(needed)) {
                System.out.println("Missing column: " + needed);
                return;
            }
        }

        // 2. Parse each line. A bad row is reported and skipped.
        List<Booking> bookings = new ArrayList<>();

        for (int i = 1; i < lines.size(); i++) {
            String line = lines.get(i);
            if (line.isBlank()) {
                continue;
            }

            String[] f = line.split(",", -1);
            if (f.length != header.length) {
                System.out.println("line " + (i + 1) + ": expected " + header.length
                        + " fields, found " + f.length);
                continue;
            }

            try {
                String city = f[col.get("city")].trim();
                LocalDate start = LocalDate.parse(f[col.get("start_date")].trim());
                LocalDate end = LocalDate.parse(f[col.get("end_date")].trim());
                int adults = Integer.parseInt(f[col.get("adults")].trim());
                String childText = f[col.get("children")].trim();
                int children = childText.isEmpty() ? 0 : Integer.parseInt(childText);

                if (end.isBefore(start)) {
                    System.out.println("line " + (i + 1) + ": end before start");
                    continue;
                }

                bookings.add(new Booking(
                        f[col.get("customer_email")].trim(), city, start, end, adults, children));

            } catch (DateTimeParseException | NumberFormatException e) {
                // One message per bad line. The loop continues with the next row.
                System.out.println("line " + (i + 1) + ": " + e.getMessage());
            }
        }

        // 3. Aggregate. TreeMap keeps the city order stable between runs.
        Map<String, int[]> byCity = new TreeMap<>();   // city -> {bookings, nights, guests}
        Set<String> customers = new HashSet<>();
        int totalBookings = 0;
        int totalNights = 0;
        int totalGuests = 0;

        for (Booking b : bookings) {
            int[] row = byCity.computeIfAbsent(b.city(), key -> new int[3]);
            row[0]++;
            row[1] += (int) b.nights();
            row[2] += b.guests();

            customers.add(b.email());
            totalBookings++;
            totalNights += (int) b.nights();
            totalGuests += b.guests();
        }

        Files.createDirectories(txt.getParent());

        // 4. Text report. The writer closes before the read below.
        try (BufferedWriter writer = Files.newBufferedWriter(txt, StandardCharsets.UTF_8,
                StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING)) {
            writer.write(String.format("Booking report %s%n", LocalDate.now()));
            writer.write(String.format("%-14s %8s %6s %6s%n",
                    "city", "bookings", "nights", "guests"));
            for (Map.Entry<String, int[]> entry : byCity.entrySet()) {
                int[] r = entry.getValue();
                writer.write(String.format("%-14s %8d %6d %6d%n",
                        entry.getKey(), r[0], r[1], r[2]));
            }
            writer.write(String.format("%-14s %8d %6d %6d%n",
                    "TOTAL", totalBookings, totalNights, totalGuests));
            writer.write(String.format("distinct customers: %d%n", customers.size()));
        }

        // 5. JSON report, built by hand so no jar is needed.
        StringBuilder json = new StringBuilder();
        json.append("{\n");
        json.append("  \"generated\": ").append(jsonString(LocalDate.now().toString())).append(",\n");
        json.append("  \"cities\": [\n");

        boolean first = true;
        for (Map.Entry<String, int[]> entry : byCity.entrySet()) {
            int[] r = entry.getValue();
            if (!first) {
                json.append(",\n");
            }
            first = false;
            json.append("    {\"city\": ").append(jsonString(entry.getKey()))
                    .append(", \"bookings\": ").append(r[0])
                    .append(", \"nights\": ").append(r[1])
                    .append(", \"guests\": ").append(r[2])
                    .append('}');
        }

        json.append("\n  ],\n");
        json.append("  \"total_bookings\": ").append(totalBookings).append(",\n");
        json.append("  \"total_nights\": ").append(totalNights).append(",\n");
        json.append("  \"total_guests\": ").append(totalGuests).append(",\n");
        json.append("  \"distinct_customers\": ").append(customers.size()).append("\n");
        json.append("}\n");

        Files.writeString(jsonFile, json.toString(), StandardCharsets.UTF_8);

        System.out.println(Files.readString(txt, StandardCharsets.UTF_8));
        System.out.println(Files.readString(jsonFile, StandardCharsets.UTF_8));
    }

    // Minimal JSON string escaper. Keys in this program are constants, so only values need it.
    static String jsonString(String value) {
        StringBuilder b = new StringBuilder("\"");
        for (int i = 0; i < value.length(); i++) {
            char c = value.charAt(i);
            switch (c) {
                case '"':  b.append("\\\""); break;
                case '\\': b.append("\\\\"); break;
                case '\n': b.append("\\n");  break;
                case '\r': b.append("\\r");  break;
                case '\t': b.append("\\t");  break;
                default:
                    if (c < 0x20) {
                        b.append(String.format("\\u%04x", (int) c));
                    } else {
                        b.append(c);
                    }
            }
        }
        return b.append('"').toString();
    }
}
```

Read the program from top to bottom once, then again by block. Lines 1 to 40 build the header map and refuse to run on a file without the columns it needs. The loop turns one CSV row into one `Booking`, and the catch clause decides that a bad row is data to report, not a reason to stop. The aggregate block produces per city totals and three global counters in one pass. The write block creates `out/`, writes the text report, closes it, then builds the JSON string and writes it with `Files.writeString`.

The output is deterministic except for the date. For the sample data, Budapest has 2 bookings, 5 nights and 4 guests, Szeged has 2 bookings, 5 nights and 6 guests, and R5 never reaches the report.

## More examples

The examples above walk the exam path once. The six below take the same two formats apart in the order a program meets them: normalise the header, convert the fields, write a CSV file, build nested JSON, indent a compact string, then hand the reading to Jackson. Each program is a single file with a `main`, and each one runs as shown.

### Example 7: Header under a BOM, with delimiter detection

Files exported from spreadsheets carry two surprises before any data arrives: a byte order mark in front of the first header name, and a delimiter that may be a semicolon. This program handles both, then builds the name to index map and checks every row against the header width.

```java
// File: CsvTableDemo.java
// Data shape: one String holds the whole CSV, the way Files.readString returns it;
// at runtime the header map is {customer_email=0, city=1, children=2}.
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

public class CsvTableDemo {

    // Files.readString already decoded the bytes, so the BOM is one char, not three.
    static String stripBom(String text) {
        return text.startsWith("\uFEFF") ? text.substring(1) : text;
    }

    // A header with semicolons and no commas is a semicolon file. Same for tabs.
    static String sniffDelimiter(String headerLine) {
        if (headerLine.indexOf(';') >= 0 && headerLine.indexOf(',') < 0) {
            return ";";
        }
        if (headerLine.indexOf('\t') >= 0 && headerLine.indexOf(',') < 0) {
            return "\t";
        }
        return ",";
    }

    public static void main(String[] args) {
        String csv = "\uFEFFcustomer_email;city;children\r\n"
                + "anna@example.com;Budapest;2\r\n"
                + "ben@example.com;Szeged;\r\n";

        // \R is any line break: \n, \r\n or \r. split("\n") leaves \r on Windows files.
        String[] lines = stripBom(csv).split("\\R");
        String delimiter = sniffDelimiter(lines[0]);
        System.out.println("delimiter=[" + delimiter + "]");

        // Pattern.quote keeps a delimiter such as "|" from acting as a regex operator.
        String[] header = lines[0].split(Pattern.quote(delimiter), -1);
        Map<String, Integer> col = new HashMap<>();
        for (int i = 0; i < header.length; i++) {
            // Lowercase and trim once, here, instead of on every lookup.
            col.putIfAbsent(header[i].trim().toLowerCase(), i);
        }

        List<String> cities = new ArrayList<>();

        for (int i = 1; i < lines.length; i++) {
            if (lines[i].isBlank()) {
                continue;
            }
            String[] f = lines[i].split(Pattern.quote(delimiter), -1);
            if (f.length != header.length) {
                System.out.println("line " + (i + 1) + ": width " + f.length + ", skipped");
                continue;
            }
            cities.add(f[col.get("city")].trim());
            // The -1 keeps the empty children field at the end of the line.
            System.out.println(f[col.get("customer_email")].trim()
                    + " children=[" + f[col.get("children")] + "]");
        }

        System.out.println("cities: " + cities);
        System.out.println("header keys: " + col.keySet());
    }
}
```

Output ends with `cities: [Budapest, Szeged]`. The `ben@` row prints `children=[]`, which is the visible proof that `-1` did its job; drop the argument and the empty field disappears, the width check then fails, and a valid row is reported as broken.

`sniffDelimiter` is a guess, not a parser. It reads the header only. A file whose header happens to contain a comma inside a quoted name defeats it, so tell the student to state the delimiter in the answer when the task gives one.

### Example 8: Typed conversion with defaults and a problem list

Every CSV field is text. The decision that matters is what an empty or broken field becomes, and the code below keeps that decision in two small helpers instead of scattering `try` blocks through the loop.

```java
// File: TypedRows.java
// Data shape: one CSV row -> Customer(email, last_name, children, birthday);
// children defaults to 0, birthday may stay null when the text is not a date.
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

public class TypedRows {

    // Null means "absent or not parseable". Zero is a real value, so it cannot stand in.
    record Customer(String email, String last_name, int children, LocalDate birthday) {
    }

    static Integer parseIntOrNull(String text) {
        String t = text.trim();
        if (t.isEmpty()) {
            return null;
        }
        try {
            return Integer.valueOf(t);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    static LocalDate parseDateOrNull(String text) {
        String t = text.trim();
        if (t.isEmpty()) {
            return null;
        }
        try {
            // LocalDate.parse is strict: 2001-02-30 throws instead of rolling over.
            return LocalDate.parse(t);
        } catch (DateTimeParseException e) {
            return null;
        }
    }

    public static void main(String[] args) {
        String csv = "customer_email,last_name,children,birthday\n"
                + "anna@example.com,Kovacs,2,1998-05-12\n"
                + "ben@example.com,Nagy,,2001-02-30\n"
                + "cara@example.com,Toth,three,1995-11-03\n";

        String[] lines = csv.split("\\R");
        List<Customer> customers = new ArrayList<>();
        List<String> problems = new ArrayList<>();

        for (int i = 1; i < lines.length; i++) {
            String[] f = lines[i].split(",", -1);

            Integer children = parseIntOrNull(f[2]);
            // Empty is not a problem, junk is. The two cases share a null return.
            if (children == null && !f[2].trim().isEmpty()) {
                problems.add("line " + (i + 1) + ": children [" + f[2] + "]");
            }

            LocalDate birthday = parseDateOrNull(f[3]);
            if (birthday == null && !f[3].trim().isEmpty()) {
                problems.add("line " + (i + 1) + ": birthday [" + f[3] + "]");
            }

            // The default is applied once, here, not in every sum further down.
            customers.add(new Customer(f[0].trim(), f[1].trim(),
                    children == null ? 0 : children, birthday));
        }

        for (Customer c : customers) {
            System.out.println(c.email() + " " + c.last_name()
                    + " children=" + c.children()
                    + " birthday=" + (c.birthday() == null ? "-" : c.birthday()));
        }
        System.out.println("problems:");
        for (String p : problems) {
            System.out.println("  " + p);
        }
    }
}
```

The output keeps three customers and reports two problems: the impossible date on line 3 and `three` on line 4. Note that the broken rows are still loaded with defaults. If the task says to drop them, add `continue` after the problem is recorded; what matters is that the choice is made in one place and stays consistent with the totals.

Returning `Integer` rather than `int` is deliberate. A primitive cannot distinguish "missing" from "0", and the children column in the exam data is exactly where that difference matters.

### Example 9: Writing CSV that survives a comma in the value

Reading is half the task. The other half is a file the next program can read, which means quoting at write time, one row per line, UTF-8 on both ends.

```java
// File: WriteCsvFile.java
// Data shape: List<String> rows -> hotels.csv with a header and two data rows;
// a description containing a comma is wrapped in quotes on disk.
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class WriteCsvFile {

    // Quote only when the value would otherwise split into extra columns.
    static String field(String value) {
        if (value == null) {
            return "";
        }
        boolean needsQuotes = value.indexOf(',') >= 0 || value.indexOf('"') >= 0
                || value.indexOf('\n') >= 0 || value.indexOf('\r') >= 0;
        return needsQuotes ? '"' + value.replace("\"", "\"\"") + '"' : value;
    }

    // varargs keeps the call site readable. A null becomes an empty field, not "null".
    static String row(String... values) {
        StringBuilder b = new StringBuilder();
        for (int i = 0; i < values.length; i++) {
            if (i > 0) {
                b.append(',');
            }
            b.append(field(values[i]));
        }
        return b.toString();
    }

    public static void main(String[] args) throws IOException {
        Path file = Files.createTempDirectory("csv-demo").resolve("hotels.csv");

        List<String> rows = List.of(
                row("hotel_id", "name", "city", "description"),
                row("10", "Danube View", "Budapest", "River side, quiet"),
                row("20", "Plain Stop", "Szeged", "He said \"cheap\" once"));

        // Files.write writes UTF-8 and a platform line separator after every row.
        Files.write(file, rows, StandardCharsets.UTF_8);

        // Raw split counts the comma and the doubled quotes as data. That is the bug
        // the quoting exists to provoke in a naive reader, so the parser is needed.
        for (String line : Files.readAllLines(file, StandardCharsets.UTF_8)) {
            System.out.println(line.split(",", -1).length + " raw pieces: " + line);
        }

        System.out.println(Files.readString(file, StandardCharsets.UTF_8));
        System.out.println("file: " + file);
    }
}
```

The raw split counts four, five, and four pieces, while the header says four columns. The quoted row is correct on disk and the naive reader is the broken part. Use `Files.write` for a small report, `BufferedWriter` when rows are produced in a loop and the file may be large.

Two details worth stating in an answer. `Files.write` appends the platform line separator, so a file written on Windows and read on Linux is still fine because the reader strips both. And `createTempDirectory` is here only so the example can run twice; in an exam answer the path comes from the task.

### Example 10: Nested JSON by hand, arrays included

A flat object needs one escape helper. A list of objects with an array inside needs the same helper plus a rule for commas: a separator goes before each element except the first, never after the last.

```java
// File: JsonReport.java
// Data shape: List<Hotel> -> a JSON array of objects, each with a tags array;
// {hotel_id, name, city, stars, tags[]}.
import java.util.List;

public class JsonReport {

    record Hotel(int hotel_id, String name, String city, int stars, List<String> tags) {
    }

    // Escapes every control character, so a tab in a description cannot break the file.
    static String str(String value) {
        if (value == null) {
            return "null";
        }
        StringBuilder b = new StringBuilder("\"");
        for (int i = 0; i < value.length(); i++) {
            char c = value.charAt(i);
            switch (c) {
                case '"':  b.append("\\\""); break;
                case '\\': b.append("\\\\"); break;
                case '\n': b.append("\\n");  break;
                case '\r': b.append("\\r");  break;
                case '\t': b.append("\\t");  break;
                case '\b': b.append("\\b");  break;
                case '\f': b.append("\\f");  break;
                default:
                    if (c < 0x20) {
                        b.append(String.format("\\u%04x", (int) c));
                    } else {
                        b.append(c);
                    }
            }
        }
        return b.append('"').toString();
    }

    static String one(Hotel h) {
        StringBuilder b = new StringBuilder("{");
        b.append("\"hotel_id\": ").append(h.hotel_id()).append(", ");
        b.append("\"name\": ").append(str(h.name())).append(", ");
        b.append("\"city\": ").append(str(h.city())).append(", ");
        b.append("\"stars\": ").append(h.stars()).append(", ");
        b.append("\"tags\": [");
        for (int i = 0; i < h.tags().size(); i++) {
            if (i > 0) {
                b.append(", ");
            }
            b.append(str(h.tags().get(i)));
        }
        return b.append("]}").toString();
    }

    static String many(List<Hotel> hotels) {
        StringBuilder b = new StringBuilder("[\n");
        for (int i = 0; i < hotels.size(); i++) {
            if (i > 0) {
                // The comma goes before the next element, never after the last one.
                b.append(",\n");
            }
            b.append("  ").append(one(hotels.get(i)));
        }
        return b.append("\n]").toString();
    }

    public static void main(String[] args) {
        List<Hotel> hotels = List.of(
                new Hotel(10, "Danube View", "Budapest", 4, List.of("river", "quiet")),
                new Hotel(20, "Plain Stop", "Szeged", 3, List.of()),
                new Hotel(30, "Quote \"Inn\"", "Gyor", 2, List.of("near\tstation")));

        String json = many(hotels);
        System.out.println(json);

        // Cheap self check: a raw tab in the text means an escaping branch was skipped.
        System.out.println("raw tab present: " + json.contains("\t"));
    }
}
```

An empty tag list renders as `[]`, and the hotel name with quotes survives. `hotel_id` and `stars` are appended as `int`, so they arrive without quotes, which is the whole difference between a number and a string in JSON.

The self check is the smallest thing that catches a missing case. A stronger one is a parser: the Jackson example below reads this exact shape, and `python3 -m json.tool` on the output is enough when Jackson is not installed.

### Example 11: Indent a compact JSON string without a library

Sometimes the JSON arrives as one long line from a log or a servlet response and the task wants it readable. A pretty printer is a scan with two states: inside a string, where nothing is structural, and outside, where braces and commas decide the layout.

```java
// File: PrettyJson.java
// Data shape: a compact JSON string in, the same document with two space indentation out.
public class PrettyJson {

    static String pretty(String json) {
        StringBuilder out = new StringBuilder();
        int depth = 0;
        boolean inString = false;
        boolean escaped = false;

        for (int i = 0; i < json.length(); i++) {
            char c = json.charAt(i);

            if (inString) {
                // Inside a string every character is data, including braces and commas.
                out.append(c);
                if (escaped) {
                    escaped = false;
                } else if (c == '\\') {
                    escaped = true;
                } else if (c == '"') {
                    inString = false;
                }
            } else if (c == '"') {
                inString = true;
                out.append(c);
            } else if (c == '{' || c == '[') {
                out.append(c).append('\n');
                depth++;
                indent(out, depth);
            } else if (c == '}' || c == ']') {
                out.append('\n');
                depth--;
                indent(out, depth);
                out.append(c);
            } else if (c == ',') {
                out.append(",\n");
                indent(out, depth);
            } else if (c == ':') {
                out.append(": ");
            } else if (!Character.isWhitespace(c)) {
                // Whitespace outside strings is dropped; the indenter writes its own.
                out.append(c);
            }
        }
        return out.toString();
    }

    static void indent(StringBuilder out, int depth) {
        out.append("  ".repeat(Math.max(depth, 0)));
    }

    public static void main(String[] args) {
        String compact = "{\"city\":\"Budapest\",\"stars\":4,\"tags\":[\"river\",\"quiet\"],"
                + "\"note\":\"{a,b}\",\"closed\":false}";

        String pretty = pretty(compact);
        System.out.println(pretty);

        // The text changed, the meaning did not: removing whitespace returns the input.
        // This comparison works only while no string value itself contains a space.
        String back = pretty.replaceAll("\\s+", "");
        System.out.println("round trip equal: " + back.equals(compact));
    }
}
```

The `note` value holds braces and a comma and comes out untouched, because the loop never treats a character inside a string as structure. `escaped` exists for one reason: the value `\"` must not be mistaken for the closing quote.

The printer is not a validator. It never checks that a brace matches, and an unescaped control character goes through. Empty objects come out as an opening brace, a newline, and a closing brace, which is valid but not what a pretty printer would choose for `{}`.

### Example 12: Jackson on a list, a tree, and pretty output

Everything above works with the JDK alone. When Jackson is on the classpath, the same work shrinks to three calls and the parsing rules stop being your problem. The jars are needed for both compile and run:

```bash
javac -cp jackson-databind-2.18.6.jar HotelJackson.java
java -cp .:jackson-databind-2.18.6.jar:jackson-core-2.18.6.jar:jackson-annotations-2.18.6.jar HotelJackson
```

```java
// File: HotelJackson.java
// Data shape: a JSON array of objects, one of them with a tags array and an extra
// owner_email field that the record does not declare.
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import java.io.IOException;
import java.util.List;

public class HotelJackson {

    record Hotel(int hotel_id, String name, String city, int stars, List<String> tags) {
    }

    public static void main(String[] args) throws IOException {
        // One mapper, configured once. FAIL_ON_UNKNOWN_PROPERTIES is on by default.
        ObjectMapper mapper = new ObjectMapper()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        String json = """
                [
                  {"hotel_id": 10, "name": "Danube View", "city": "Budapest", "stars": 4,
                   "tags": ["river", "quiet"], "owner_email": "owner@example.com"},
                  {"hotel_id": 20, "name": "Plain Stop", "city": "Szeged", "stars": 3,
                   "tags": []}
                ]
                """;

        // 1. Typed list. TypeReference carries List<Hotel> past type erasure; without it
        // readValue would hand back List<LinkedHashMap>.
        List<Hotel> hotels = mapper.readValue(json, new TypeReference<List<Hotel>>() { });
        for (Hotel h : hotels) {
            System.out.println(h.hotel_id() + " " + h.name() + " tags=" + h.tags());
        }

        // 2. Tree access for the part the record does not model.
        JsonNode root = mapper.readTree(json);
        System.out.println("nodes: " + root.size());
        for (JsonNode node : root) {
            String owner = node.path("owner_email").asText("none");
            ArrayNode tags = (ArrayNode) node.path("tags");
            StringBuilder joined = new StringBuilder();
            for (JsonNode tag : tags) {
                if (joined.length() > 0) {
                    joined.append('/');
                }
                joined.append(tag.asText());
            }
            System.out.println(node.path("name").asText() + " owner=" + owner
                    + " tags=" + (joined.length() == 0 ? "-" : joined));
        }

        // 3. Pretty output for a file, compact for a request body.
        String pretty = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(hotels);
        String compact = mapper.writeValueAsString(hotels.get(0));
        System.out.println(pretty);
        System.out.println(compact);
    }
}
```

The three calls to remember are `readValue` with a `Class` or a `TypeReference`, `readTree` for a shape you do not have a class for, and `writeValueAsString`, with `writerWithDefaultPrettyPrinter()` in front when the output is read by a person.

Two API details in the loop. `root` is an `ArrayNode` and iterating it yields the elements, so no index is needed. `path("owner_email")` returns a `MissingNode` for the second hotel, and `asText("none")` turns that into a default; `get()` would return `null` there and the next call would throw.

If the record had a `LocalDate` field, the JVM would ask for `jackson-datatype-jsr310` at serialization time, and adding that jar also means `mapper.registerModule(new JavaTimeModule())`. Keeping the date as a `String` in the DTO is the cheaper answer in an exam.

## Common mistakes

- `split(",")` without the `-1`. Trailing empty fields vanish and fixed indexes shift.
- `split(".")` instead of `split("\\.")`. The dot is a regex wildcard.
- Splitting a quoted field with a comma in it. The row gains a column and every later value lands in the wrong place.
- Treating the header as data, or hard coding `i = 1` while the header was skipped twice.
- Using fixed indexes when the task reorders columns. Build the name to index map.
- Calling `parseInt` on an untrimmed or empty field. `NumberFormatException` arrives at runtime with a line number you did not print.
- Writing CSV with plain concatenation and no quoting. The file looks fine until a value contains a comma.
- Building JSON with string concatenation and no escaping. One quote in a name produces a file no parser accepts.
- Adding a trailing comma after the last array element or object member. Strict parsers reject it.
- Writing a null as the four character string `"null"`. The value changes type.
- Feeding nested JSON to a hand written `indexOf` parser. It finds the first matching key at any depth.
- Expecting Jackson to deserialize a class with no default constructor, or to ignore unknown fields without configuration.
- Putting `LocalDate` in a Jackson DTO without the Java time module. Serialization stops with `InvalidDefinitionException`.
- Reading a UTF-8 file with the platform charset. Accented city names split into two broken fields on the next write.
- Assuming the CSV separator is a comma. Some locales export with semicolons, and some tasks say so in one sentence.
- Splitting on `\n` by hand and leaving `\r` at the end of every value. `readLine` already removes it.
- Treating a zero or empty `children` field as a parse error. The field is often optional.
- Summing money in `double` and printing cents that do not add up.

## Exam checklist

- Can you write `split(",", -1)` and explain in one sentence what the limit changes?
- Does the program detect the header by name, lowercase it, and refuse to continue when a needed column is missing?
- Is every row checked against the header length before indexing?
- Does one bad row produce a message with its line number and leave the rest of the file usable?
- Can you quote and unquote a field that contains a comma, a quote, and a newline?
- Does the JSON writer escape backslash, quote, newline, tab, and control characters?
- Is every number written as a number, every boolean as `true` or `false`, and every missing value as `null`?
- If Jackson is available, can you read a list with `TypeReference`, read one field from a `JsonNode`, and write pretty JSON?
- Does the program still work when Jackson is not on the classpath, or does it fail with a clear message?
- Are the input and output files opened as UTF-8, and is the output folder created before the first write?
- Do the totals in the text report and the JSON report agree, and is the city order stable?
- Can you name the RFC that describes the CSV quoting rules, and the one case your parser does not handle?

