# ObjectMapper.writeValueAsString()

Java command · Jackson

Serializes an object or a tree to JSON. Use the pretty printer for a report a human will read, and the plain writer for a compact file.

## Syntax

```java
mapper.writerWithDefaultPrettyPrinter().writeValueAsString(object)
```

## Example

```java
ObjectMapper mapper = new ObjectMapper();

Map<String, Object> report = new LinkedHashMap<>();
report.put("city", "Budapest");
report.put("bookings", 2);
report.put("open", true);

String json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(report);
Files.writeString(Path.of("out", "report.json"), json, StandardCharsets.UTF_8);
System.out.println(json);
```

## Details

Jackson writes UTF-8 bytes for `writeValue(File, ...)`. `writeValueAsString` returns a String, so write it with an explicit charset. LocalDate fields need the Java time module, or keep dates as String in the DTO.
