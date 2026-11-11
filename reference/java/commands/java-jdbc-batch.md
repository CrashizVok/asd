# addBatch and executeBatch

Java command · JDBC

Sends many parameter sets in one round trip. The returned array holds one count per statement.

## Syntax

```java
ps.addBatch(); int[] counts = ps.executeBatch();
```

## Example

```java
String sql = "INSERT INTO bookings "
        + "(customer_email, hotel_id, start_date, end_date, adults, children) "
        + "VALUES (?, ?, ?, ?, ?, ?)";

try (Connection conn = DriverManager.getConnection(url, user, password);
     PreparedStatement ps = conn.prepareStatement(sql)) {

    conn.setAutoCommit(false);
    try {
        for (int i = 0; i < rows.size(); i++) {
            String[] row = rows.get(i);
            ps.setString(1, row[0]);
            ps.setInt(2, Integer.parseInt(row[1]));
            ps.setDate(3, java.sql.Date.valueOf(row[2]));
            ps.setDate(4, java.sql.Date.valueOf(row[3]));
            ps.setInt(5, Integer.parseInt(row[4]));
            ps.setInt(6, Integer.parseInt(row[5]));
            ps.addBatch();
        }

        int[] counts = ps.executeBatch();
        conn.commit();
        System.out.println("statements: " + counts.length);

        // SUCCESS_NO_INFO (-2) means the driver will not report a count.
        for (int count : counts) {
            if (count == java.sql.Statement.SUCCESS_NO_INFO) {
                System.out.println("count unknown");
            }
        }
    } catch (SQLException e) {
        conn.rollback();
        throw e;
    }
}
```

## Details

Batch without a transaction still commits row by row in autoCommit mode, which defeats part of the purpose. Disable autoCommit, add every row, execute, then commit once.

MySQL performs better with rewriteBatchedStatements=true in the URL. Keep batches in the hundreds or low thousands; huge batches are hard to retry after a failure.
