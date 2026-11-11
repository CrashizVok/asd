# manual JSON array

Java command · JSON

Builds an array without a library by putting the comma before every element except the first, which is the only way to avoid a trailing comma.

## Syntax

```java
for (int i = 0; i < list.size(); i++) { if (i > 0) b.append(','); }
```

## Example

```java
StringBuilder b = new StringBuilder("[\n");
for (int i = 0; i < cities.size(); i++) {
    if (i > 0) {
        b.append(",\n");   // separator before the element, never after the last
    }
    b.append("  ").append(str(cities.get(i)));
}
b.append("\n]");
String json = b.toString();

// Empty list must still produce [] and not a stray newline between the brackets.
System.out.println(cities.isEmpty() ? "[]" : json);
```

## Details

The alternative, appending a comma after every element and cutting the last one, also works but breaks as soon as the list is empty: `setLength(length - 1)` then removes a bracket.

The same rule applies one level up. A member list inside an object uses `, ` between members and no separator after the final one. A JSON parser rejects `[1,2,]` and `{"a":1,}` outright, so a trailing comma is a syntax error, not a style issue.

When the array holds objects, build each object in its own method and append the returned text. That keeps the comma rule in one place and makes the nesting readable.
