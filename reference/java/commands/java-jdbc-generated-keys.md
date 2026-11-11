# getGeneratedKeys()

Java command · JDBC

Returns auto-increment values created by the statement, without a second query.

## Syntax

```java
conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)
```

## Example

```java
String sql = "INSERT INTO hotels (city, name, description, stars, owner_email) "
        + "VALUES (?, ?, ?, ?, ?)";

try (Connection conn = DriverManager.getConnection(url, user, password);
     PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

    ps.setString(1, "Vienna");
    ps.setString(2, "Hotel Park");
    ps.setString(3, "Family hotel with a large garden");
    ps.setInt(4, 5);
    ps.setString(5, "owner2@example.com");

    int rows = ps.executeUpdate();
    if (rows != 1) {
        throw new SQLException("expected one row, got " + rows);
    }

    try (ResultSet keys = ps.getGeneratedKeys()) {
        if (keys.next()) {
            int hotelId = keys.getInt(1);
            System.out.println("new hotel_id: " + hotelId);
        }
    }
}
```

## Details

Use the key result set instead of SELECT LAST_INSERT_ID(). The second query can run on a different pooled connection and return another session's id.

The key result set has one column in most drivers, so getInt(1) is the portable read. Some drivers also allow the column name.
