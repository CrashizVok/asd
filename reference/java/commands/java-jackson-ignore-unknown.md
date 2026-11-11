# Ignore unknown JSON fields

Java command · Jackson

Stops Jackson from throwing when the JSON has a property the class does not declare. Useful when the input gains fields between tasks.

## Syntax

```java
mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
```

## Example

```java
ObjectMapper mapper = new ObjectMapper();
mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

Hotel hotel = mapper.readValue(json, Hotel.class);

// Or on the class, which keeps the setting next to the data shape:
// @JsonIgnoreProperties(ignoreUnknown = true)
// record Hotel(int hotel_id, String name, String city) { }
```

## Details

The default is to fail on an unknown property, which is a useful check for a typo in a field name. Turn it off only when the input is outside your control. The annotation version needs `jackson-annotations` on the classpath, which databind already pulls in.
