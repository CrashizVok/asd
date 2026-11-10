# executeUpdate

Java command · JDBC

Runs INSERT, UPDATE, or DELETE and returns the number of affected rows.

## Syntax

```java
int rows = ps.executeUpdate();
```

## Example

```java
String sql = "UPDATE hotels SET stars = ? WHERE id = ?";
try (PreparedStatement ps = conn.prepareStatement(sql)) {
    ps.setInt(1, 5);
    ps.setInt(2, 3);
    int rows = ps.executeUpdate();
    System.out.println(rows + " row(s) updated");
}
```
