# setNull

Java command · Parameters

Binds a real SQL NULL with an explicit type. More portable than setString(index, null), which some drivers reject or send as an empty string.

## Syntax

```java
ps.setNull(index, Types.VARCHAR)
```

## Example

```java
// Data shape: the column type decides the Types constant.
String sql = "UPDATE hotels SET description = ?, image = ? WHERE hotel_id = ?";

try (PreparedStatement ps = conn.prepareStatement(sql)) {
    // A null String means "no description", so send SQL NULL, not an empty string.
    ps.setNull(1, Types.VARCHAR);

    // Binary columns need their own type constant.
    ps.setNull(2, Types.BLOB);

    ps.setInt(3, 1);
    ps.executeUpdate();
}

// Types constants worth knowing: VARCHAR, CHAR, INTEGER, BIGINT, DECIMAL,
// DATE, TIMESTAMP, BOOLEAN, BLOB, and NULL for an untyped NULL.
```

## Details

`setString(index, null)` happens to work with Connector/J because the driver translates it, but the JDBC specification does not require that. `setNull` states the type, so the driver can prepare the parameter without guessing.

An untyped `Types.NULL` is accepted by some drivers and rejected by others when the column type cannot be inferred. Name the real column type and the problem disappears.

The distinction matters for queries. `WHERE description IS NULL` finds a `setNull` row, while `WHERE description = ''` finds an empty string. Both look the same in a Java object where the field is null, so decide at the write side which one you mean.
