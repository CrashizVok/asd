# JDBC URL parts

Java command · Connection

The URL selects the driver, names the server and the schema, and carries driver options. Credentials belong in getConnection, not in the URL.

## Syntax

```java
jdbc:mysql://host:port/database?option=value
```

## Example

```java
// Data shape: jdbc:<subprotocol>://<host>:<port>/<database>?<option>=<value>
String url = "jdbc:mysql://localhost:3306/bookings"
        + "?useSSL=false&serverTimezone=UTC&rewriteBatchedStatements=true";

// The text after jdbc: picks the driver, here mysql.
// 3306 is the MySQL default. SQLite has no host and no port.
String sqlite = "jdbc:sqlite:bookings.db";

try (Connection conn = DriverManager.getConnection(url, "root", System.getenv("DB_PASSWORD"))) {
    // The query string is read by the driver before the connection is opened.
    System.out.println(conn.getMetaData().getURL());
    System.out.println(conn.getMetaData().getDatabaseProductName()); // MySQL
} catch (SQLException e) {
    // No suitable driver means the classpath, not the server, is wrong.
    System.out.println(e.getMessage());
}
```

## Details

Read the URL right to left. The database name is the last path segment, the host and port come before it, and the subprotocol right after `jdbc:` decides which driver answers. A missing or misspelled subprotocol gives `No suitable driver found` even when the jar sits on the classpath.

Options after the `?` are driver specific. `serverTimezone=UTC` stops Connector/J 8 from shifting timestamps, and `rewriteBatchedStatements=true` turns a batch of inserts into multi-row statements. `useSSL=false` is acceptable only for a local exam database.

Keep the password out of the URL. URLs are printed by `getMetaData().getURL()`, written to logs, and captured in shell history.
