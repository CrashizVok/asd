# Build JSON with StringBuilder

Java command · JSON

Builds a JSON document without a library. Numbers, booleans, and null go in raw; every string goes through an escaper.

## Syntax

```java
json.append("{\"city\": ").append(jsonString(city)).append("}")
```

## Example

```java
StringBuilder json = new StringBuilder();
json.append("{\n");
json.append("  \"city\": ").append(jsonString("Budapest")).append(",\n");
json.append("  \"stars\": ").append(4).append(",\n");
json.append("  \"open\": ").append(true).append(",\n");
Integer ownerId = null;
json.append("  \"owner_id\": ").append(ownerId).append("\n");
json.append("}");

System.out.println(json);
```

## Details

No trailing comma before a closing bracket. Keys are always quoted. A null reference must print `null`, not the four character string `"null"`; the second is a String and a reader will type it as one.

This is fine for a fixed, small object that the program writes. Do not hand parse a document that nests or that someone else produced.
