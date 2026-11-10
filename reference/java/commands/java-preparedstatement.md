# PreparedStatement

Java command · JDBC

Runs a parameterized query. setInt, setString, and setDate fill the placeholders safely.

## Syntax

```java
PreparedStatement ps = conn.prepareStatement("SELECT * FROM hotels WHERE id = ?");
```

## Example

```java
String sql = "SELECT name, stars FROM hotels WHERE id = ?";
try (PreparedStatement ps = conn.prepareStatement(sql)) {
    ps.setInt(1, 3);
    try (ResultSet rs = ps.executeQuery()) {
        while (rs.next()) {
            System.out.println(rs.getString("name"));
        }
    }
}
```
