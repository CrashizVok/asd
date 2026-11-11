# SQLException details

Java command · Errors

SQLState is the standard five character code, the error code is vendor specific, and the chained next exception carries the rest of the batch failures.

## Syntax

```java
e.getSQLState() / e.getErrorCode() / e.getNextException()
```

## Example

```java
try (Connection conn = DriverManager.getConnection(url, user, password);
     PreparedStatement ps = conn.prepareStatement(
             "INSERT INTO hotels (city, name, description, stars, owner_email) "
                     + "VALUES (?, ?, ?, ?, ?)")) {

    ps.setString(1, "Vienna");
    ps.setString(2, "Hotel Ring");
    ps.setString(3, "Small hotel beside the ring road");
    ps.setInt(4, 4);
    ps.setString(5, "owner@example.com");
    ps.executeUpdate();

} catch (SQLIntegrityConstraintViolationException e) {
    // Class 23 is an integrity constraint, usually a duplicate key or a broken FK.
    System.out.println("state " + e.getSQLState() + ", code " + e.getErrorCode());
    System.out.println(e.getMessage());
} catch (SQLException e) {
    // Log all three. The message alone rarely names the constraint.
    System.out.println("state " + e.getSQLState());     // e.g. 42S02
    System.out.println("vendor code " + e.getErrorCode()); // e.g. 1146
    System.out.println("message " + e.getMessage());

    // A batch can attach one exception per failed statement.
    for (SQLException next = e.getNextException(); next != null; next = next.getNextException()) {
        System.out.println("also: " + next.getMessage());
    }

    throw new IllegalStateException("hotel insert failed", e); // keep the cause
}
```

## Details

`SQLState` comes from the SQL standard and is the portable part. `08` means connection failure, `23` integrity violation, `28` invalid authorization, `42` syntax or missing object, and `40` deadlock or timeout. `getErrorCode()` is whatever the vendor returned and means nothing on another database.

`42S02` from MySQL means a missing table, `42S22` a missing column. Those two cover most first-run failures, and both are in the message as well, so read it before adding logging.

Subclasses carry meaning: `SQLIntegrityConstraintViolationException` is recoverable by showing a duplicate message, `SQLTimeoutException` is worth a retry, and `SQLTransientConnectionException` suggests a pool problem. Catch the subclass you can act on and let the rest escape.

Always pass the original exception as the cause when you translate. Losing it removes the SQLState from every log line above the repository.
