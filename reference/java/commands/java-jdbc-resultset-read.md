# ResultSet.next()

Java command · JDBC

Moves the cursor to the next row and returns false after the last one. The cursor starts before the first row.

## Syntax

```java
while (rs.next()) { rs.getInt("column"); }
```

## Example

```java
String sql = "SELECT hotel_id, name, stars FROM hotels ORDER BY hotel_id";

try (Connection conn = DriverManager.getConnection(url, user, password);
     PreparedStatement ps = conn.prepareStatement(sql);
     ResultSet rs = ps.executeQuery()) {

    while (rs.next()) {
        int id = rs.getInt("hotel_id");
        String name = rs.getString("name");
        int stars = rs.getInt("stars");

        // getInt returns 0 for SQL NULL, so 0 and NULL look identical here.
        Integer nullableStars = stars;
        if (rs.wasNull()) {
            nullableStars = null;
        }

        System.out.println(id + " " + name + " " + nullableStars);
    }
}
```

## Details

Read by label when the query is stable, by index when two columns share a label. Both are 1-based for indexes and case-insensitive in most drivers.

The result set closes when its statement closes, but closing it explicitly returns the cursor to the server sooner.
