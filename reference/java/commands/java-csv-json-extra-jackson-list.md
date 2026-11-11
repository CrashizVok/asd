# readValue with TypeReference

Java command · Jackson

Deserializes a JSON array into a typed list. TypeReference carries the element type past type erasure.

## Syntax

```java
mapper.readValue(json, new TypeReference<List<Hotel>>() { })
```

## Example

```java
ObjectMapper mapper = new ObjectMapper()
        .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

record Hotel(int hotel_id, String name, String city, int stars) { }

String json = """
        [{"hotel_id": 10, "name": "Danube View", "city": "Budapest", "stars": 4,
          "owner_email": "owner@example.com"}]
        """;

List<Hotel> hotels = mapper.readValue(json, new TypeReference<List<Hotel>>() { });
for (Hotel h : hotels) {
    System.out.println(h.hotel_id() + " " + h.name());
}
// Without the TypeReference the list would hold LinkedHashMap and the cast would fail.
```

## Details

`new TypeReference<List<Hotel>>() { }` is anonymous on purpose: the empty braces keep the generic type in the class file, where `readValue` can read it. A plain `List.class` loses the element type.

Records work from Jackson 2.12 without extra configuration, because component names match the JSON keys. If the JSON uses different names, put `@JsonProperty("hotel_id")` on the component. A class with no default constructor and no creator annotation fails with `InvalidDefinitionException`.

An unknown property such as `owner_email` throws unless `FAIL_ON_UNKNOWN_PROPERTIES` is off or the class carries `@JsonIgnoreProperties(ignoreUnknown = true)`. Set that once on the mapper, not per call.
