# ObjectMapper.readTree()

Java command · Jackson

Parses JSON into a tree when the shape is unknown or changes between tasks. Read fields with path() and convert with asText, asInt, asBoolean.

## Syntax

```java
JsonNode root = mapper.readTree(json)
```

## Example

```java
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

ObjectMapper mapper = new ObjectMapper();
JsonNode root = mapper.readTree("{\"hotel\":{\"city\":\"Budapest\",\"stars\":4}}");

String city = root.path("hotel").path("city").asText("unknown");
int stars = root.path("hotel").path("stars").asInt(0);
System.out.println(city + " " + stars);

// path() returns a MissingNode; get() returns null and needs a null check.
System.out.println(root.path("missing").asText("default"));
```

## Details

`asText()` on a number returns its text form, and `asInt()` on a text field parses it when possible. Use `isArray()` before iterating, and `for (JsonNode item : root.path("rooms"))` over an array node.
