# ObjectMapper.readValue()

Java command · Jackson

Deserializes JSON into a class or record. Requires jackson-databind plus core and annotations on the classpath.

## Syntax

```java
mapper.readValue(json, Customer.class)
```

## Example

```java
ObjectMapper mapper = new ObjectMapper();

// One object from a file
Hotel hotel = mapper.readValue(Path.of("hotel.json").toFile(), Hotel.class);

// A list needs a TypeReference, because generics are erased at runtime
List<Hotel> hotels = mapper.readValue(json,
        new TypeReference<List<Hotel>>() {});

System.out.println(hotels.size());
```

## Details

The class needs a no argument constructor or, on Jackson 2.12 and later, record components that match the JSON keys. Unknown properties throw by default; see the ignore unknown entry. `readValue` also accepts a `String`, an `InputStream`, and a `File`.
