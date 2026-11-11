# setFetchSize

Java command · Results

Hints how many rows the driver should retrieve per round trip. A hint only, and some drivers ignore it without streaming enabled.

## Syntax

```java
ps.setFetchSize(500)
```

## Example

```java
// Data shape: one cursor, rows pulled in groups of 500 instead of all at once.
String sql = "SELECT booking_id, customer_email, start_date FROM bookings ORDER BY booking_id";

try (Connection conn = DriverManager.getConnection(url, user, password);
     PreparedStatement ps = conn.prepareStatement(sql)) {

    // MySQL streams only when the statement is forward-only and the fetch size is
    // positive; Connector/J also honours useCursorFetch=true in the URL.
    ps.setFetchSize(500);

    try (ResultSet rs = ps.executeQuery()) {
        long rows = 0;
        while (rs.next()) {
            rows++;
        }
        System.out.println("rows read: " + rows);
    }
}

// The default result set is forward-only, which is what streaming needs.
```

## Details

Fetch size trades memory for round trips. A large value means fewer network waits and more rows held in the driver. A small value keeps memory flat and costs more trips. A few hundred is a normal starting point for a report.

MySQL's default behaviour is to read the whole result set into memory before `executeQuery` returns. Real streaming needs `setFetchSize(Integer.MIN_VALUE)` with Connector/J, or `useCursorFetch=true` plus a positive fetch size. Without one of those, the call is accepted and ignored.

A streaming result set holds the connection open until it is closed. Reading a million rows and then running another statement on the same connection fails or blocks, so keep the streaming read on its own connection.
