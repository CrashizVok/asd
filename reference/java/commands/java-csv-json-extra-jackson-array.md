# walk a JSON array

Java command · Jackson

readTree returns an ArrayNode for a JSON array, and the enhanced for loop yields its elements without indexes.

## Syntax

```java
for (JsonNode item : arrayNode)
```

## Example

```java
JsonNode root = mapper.readTree(json);
System.out.println(root.size());          // number of elements in the array

for (JsonNode node : root) {
    String name = node.path("name").asText("?");

    // path() returns a MissingNode when the key is absent; get() returns null.
    String owner = node.path("owner_email").asText("none");

    // An array of strings iterates the same way.
    StringBuilder tags = new StringBuilder();
    for (JsonNode tag : node.path("tags")) {
        if (tags.length() > 0) {
            tags.append('/');
        }
        tags.append(tag.asText());
    }
    System.out.println(name + " owner=" + owner + " tags=" + tags);
}
```

## Details

`asText(default)` is the safe read for a field that may be missing or null. `asInt(0)` and `asBoolean(false)` take the same default argument. `textValue()` returns `null` for a non textual node, so use it only when the type is already known.

A JSON object also iterates, but then the loop yields its values and the keys are lost. Walk the keys with `fieldNames()` or `properties()` when the shape is unknown.

Cast to `ArrayNode` only after `isArray()` or when the document is known. A `TextNode` cast to `ArrayNode` throws `ClassCastException`, and `path("tags")` on an absent key gives a `MissingNode`, which is not an array either.
