# clearBatch

Java command · Batch

Drops the accumulated parameter sets without executing them. Call it after each executeBatch so a long input does not grow driver memory.

## Syntax

```java
ps.executeBatch(); ps.clearBatch();
```

## Example

```java
// Data shape: List<String[]> -> counts per chunk, memory stays flat.
String sql = "INSERT INTO bookings "
        + "(customer_email, hotel_id, start_date, end_date, adults, children) "
        + "VALUES (?, ?, ?, ?, ?, ?)";

int chunk = 500;
int pending = 0;

try (Connection conn = DriverManager.getConnection(url, user, password);
     PreparedStatement ps = conn.prepareStatement(sql)) {

    conn.setAutoCommit(false);

    for (String[] row : rows) {
        ps.setString(1, row[0]);
        ps.setInt(2, Integer.parseInt(row[1]));
        ps.setDate(3, java.sql.Date.valueOf(row[2]));
        ps.setDate(4, java.sql.Date.valueOf(row[3]));
        ps.setInt(5, Integer.parseInt(row[4]));
        ps.setInt(6, Integer.parseInt(row[5]));
        ps.addBatch();
        pending++;

        if (pending == chunk) {
            int[] counts = ps.executeBatch();
            ps.clearBatch();   // release the parameter sets the driver kept
            pending = 0;
        }
    }

    if (pending > 0) {
        ps.executeBatch();
    }

    conn.commit();
}
```

## Details

Without `clearBatch`, the driver keeps every parameter set until the statement is closed. A loop over a million rows then holds a million parameter arrays, and the memory win from batching disappears. After `executeBatch` the sets are executed but not necessarily discarded.

The chunk size is a compromise. Each `executeBatch` is one round trip, so 500 rows per trip is fine and 50 rows is wasteful. Above a few thousand, a failure means retrying a large unit and the driver's packet limit can be reached.

`executeBatch` returns one count per statement. `Statement.SUCCESS_NO_INFO` (-2) means the driver executed the statement but will not report a count, which is normal for some drivers and is not an error.
