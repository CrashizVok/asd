# Generated keys by column

Java command · Keys

Asks for named generated columns instead of every generated column. Useful when a table has more than one auto-generated or defaulted column.

## Syntax

```java
conn.prepareStatement(sql, new String[]{"hotel_id"})
```

## Example

```java
String sql = "INSERT INTO hotels (city, name, description, stars, owner_email) "
        + "VALUES (?, ?, ?, ?, ?)";

// The array names the columns you want back, in the order you want them.
try (PreparedStatement ps = conn.prepareStatement(sql, new String[]{"hotel_id"})) {
    ps.setString(1, "Budapest");
    ps.setString(2, "Hotel Sunrise");
    ps.setString(3, "Quiet hotel near the river");
    ps.setInt(4, 4);
    ps.setString(5, "owner@example.com");
    ps.executeUpdate();

    try (ResultSet keys = ps.getGeneratedKeys()) {
        if (keys.next()) {
            // Read by index for portability, by name when the driver allows it.
            int hotelId = keys.getInt(1);
            System.out.println("new hotel_id: " + hotelId);
        }
    }
}

// Statement.RETURN_GENERATED_KEYS is the shorter form when one key is enough.
```

## Details

Both forms reach the same driver call. `RETURN_GENERATED_KEYS` asks for all generated columns, while the string array asks for the named ones. With one auto-increment column the difference is invisible, and with a table that also has a generated timestamp it matters.

The returned result set has one row and one column per requested key for an insert. For a batch, the driver usually returns one row per statement, but the order is not guaranteed by the specification. Do not zip the key rows against your input list unless the driver documents it.

Read with `getInt(1)` in an exam answer. Column labels in the key result set are driver specific, so a name that works with Connector/J may fail with another driver.
