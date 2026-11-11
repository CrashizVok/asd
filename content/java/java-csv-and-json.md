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

