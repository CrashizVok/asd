# DriverManager.getConnection()

Java command · JDBC

Opens a physical database connection for a JDBC URL. Close it when the unit of work ends.

## Syntax

```java
DriverManager.getConnection(url, user, password)
```

## Example

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

String url = "jdbc:mysql://localhost:3306/bookings?useSSL=false&serverTimezone=UTC";
String user = "root";
String password = System.getenv("DB_PASSWORD");

try (Connection conn = DriverManager.getConnection(url, user, password)) {
    System.out.println("connected: " + conn.getMetaData().getDatabaseProductName());
    System.out.println("autoCommit: " + conn.getAutoCommit()); // true by default
} catch (SQLException e) {
    // SQLState is standard, error code is vendor specific.
    System.out.println("SQLState " + e.getSQLState() + ", code " + e.getErrorCode());
    System.out.println(e.getMessage());
}
```

## Details

Each call returns a new physical connection unless a pool sits behind the driver. Opening one per query is slow and can exhaust the server's connection limit under load.

Credentials belong in the method arguments, not in the URL, because URLs end up in logs and shell history.
