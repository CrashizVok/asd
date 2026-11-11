# numbers, booleans and null by hand

Java command · JSON

A number, a boolean, and a null are appended without quotes; only text goes through the string escaper.

## Syntax

```java
b.append(value == null ? "null" : value);
```

## Example

```java
StringBuilder b = new StringBuilder("{");
b.append("\"hotel_id\": ").append(hotelId).append(", ");      // 10, no quotes
b.append("\"stars\": ").append(stars).append(", ");            // 4, no quotes
b.append("\"open\": ").append(open).append(", ");              // true, no quotes

// A null reference is the JSON literal null. String.valueOf(null) would be the text "null".
Integer ownerId = null;
b.append("\"owner_id\": ").append(ownerId == null ? "null" : ownerId);
b.append('}');

System.out.println(b);   // {"hotel_id": 10, "stars": 4, "open": true, "owner_id": null}
```

## Details

The four scalars a hand written writer must not quote are numbers, `true`, `false`, and `null`. A quoted `"4"` is a string, and a reader that expects an integer throws or silently skips the field.

`String.valueOf(null)` returns the four character string `null`, and `"" + null` does the same. Both produce `"null"`, which is a valid string and the wrong value. Test the reference before appending.

For money, append `BigDecimal.toPlainString()` rather than a `double`. `double` prints `19.99` fine today and `19.989999999999998` after a few sums, and the JSON parser will faithfully preserve the noise.
