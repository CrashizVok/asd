# writerWithDefaultPrettyPrinter

Java command · Jackson

Serializes with two space indentation, for a report a person reads. The plain writeValueAsString stays compact.

## Syntax

```java
mapper.writerWithDefaultPrettyPrinter().writeValueAsString(obj)
```

## Example

```java
ObjectMapper mapper = new ObjectMapper();

List<Hotel> hotels = List.of(
        new Hotel(10, "Danube View", "Budapest"));

// Compact: one line, for a request body or a log entry.
String compact = mapper.writeValueAsString(hotels);

// Indented: for a file the examiner or a human opens.
String pretty = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(hotels);
System.out.println(pretty);

// Straight to a file, UTF-8, no intermediate String.
Path out = Path.of("out", "hotels.json");
Files.createDirectories(out.getParent());
mapper.writerWithDefaultPrettyPrinter().writeValue(out.toFile(), hotels);
```

## Details

The pretty printer is a writer setting, so it can be reused: keep `ObjectWriter pretty = mapper.writerWithDefaultPrettyPrinter()` in a field when several files are written.

The exact layout is Jackson's choice, including spaces before colons and arrays kept on one line when short. Do not compare the text in a test; parse it and compare values instead.

Writing to a `Path` needs `toFile()`, because the `writeValue` overload takes `File`, `OutputStream`, or `Writer`. `Files.writeString(out, pretty, StandardCharsets.UTF_8)` is the two step version when the string is needed anyway.
