# JDBC connection

Java command · JDBC

Connects to a database. Use PreparedStatement with ? placeholders to avoid SQL injection.

## Syntax

```java
DriverManager.getConnection(url, user, password)
```

## Example

```java
import java.sql.*;

String url = "jdbc:mysql://localhost:3306/bookings";
try (Connection conn = DriverManager.getConnection(url, "root", "password")) {
    System.out.println("connected");
}
```
