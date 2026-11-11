# setQueryTimeout

Java command · Connection

Limits how long a statement may run, in seconds. The driver cancels it and throws SQLTimeoutException when the limit passes.

## Syntax

```java
ps.setQueryTimeout(5)
```

## Example

```java
// Data shape: seconds, not milliseconds. 0 means no limit.
String sql = "SELECT hotel_id, name FROM hotels WHERE city = ?";

try (Connection conn = DriverManager.getConnection(url, user, password);
     PreparedStatement ps = conn.prepareStatement(sql)) {

    ps.setQueryTimeout(5); // cancel after five seconds
    ps.setString(1, "Budapest");

    try (ResultSet rs = ps.executeQuery()) {
        while (rs.next()) {
            System.out.println(rs.getInt("hotel_id") + " " + rs.getString("name"));
        }
    }
} catch (SQLTimeoutException e) {
    // A subclass of SQLException, so catch it first when the reaction differs.
    System.out.println("query cancelled after the timeout");
}

// The same limit can be set once on the statement:
// st.setQueryTimeout(5);
```

## Details

The timeout is implemented as a cancel request from the driver, so the server has to support cancellation. MySQL does, through a second connection that sends `KILL QUERY`. The cancel itself can fail, in which case the original statement keeps running and the exception says why.

Five seconds is generous for an indexed lookup and far too long for a health check. Set the value per statement, not once for the whole application, because a report and a login query have different budgets.

A timeout is not a substitute for an index. A query that times out under load usually needs a better plan, not a longer limit.
