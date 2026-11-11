# Connection.prepareStatement()

Java command · JDBC

Creates a statement with placeholders. Binding values separately prevents injection and lets the driver handle quoting.

## Syntax

```java
conn.prepareStatement(sqlWithQuestionMarks)
```

## Example

```java
String sql = "SELECT hotel_id, name, stars FROM hotels "
        + "WHERE city = ? AND stars >= ? ORDER BY stars DESC";

try (Connection conn = DriverManager.getConnection(url, user, password);
     PreparedStatement ps = conn.prepareStatement(sql)) {

    ps.setString(1, "Budapest"); // indexes start at 1
    ps.setInt(2, 4);

    try (ResultSet rs = ps.executeQuery()) {
        while (rs.next()) {
            System.out.println(rs.getInt("hotel_id") + " " + rs.getString("name"));
        }
    }
}

// NULL needs a type, not setString(index, null).
ps.setNull(3, java.sql.Types.VARCHAR);
```

## Details

Placeholders stand for values only. A table name, a column name, or ASC and DESC cannot be bound, so build those from a fixed whitelist in Java.

Unbound parameters fail at execute time. The driver message names the missing index, which is usually enough to find the bug.
