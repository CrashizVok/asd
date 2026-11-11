# Savepoint

Java command · Transactions

Marks a point inside a transaction. Rolling back to it undoes only the later statements and leaves the transaction open for more work.

## Syntax

```java
Savepoint sp = conn.setSavepoint("name"); conn.rollback(sp);
```

## Example

```java
// Data shape: Savepoint is an opaque handle tied to one open transaction.
conn.setAutoCommit(false);

Savepoint beforeOptionalStep = conn.setSavepoint("before_optional_step");

try {
    // Work that came before the savepoint is protected from this failure.
    try (PreparedStatement ps = conn.prepareStatement(
            "UPDATE bookings SET adults = ? WHERE booking_id = ?")) {

        ps.setInt(1, 4);
        ps.setInt(2, 7);
        int rows = ps.executeUpdate();

        if (rows != 1) {
            throw new SQLException("booking 7 does not exist");
        }
    }

    conn.releaseSavepoint(beforeOptionalStep); // success, marker no longer needed
} catch (SQLException e) {
    // Undo only the optional step, then keep the transaction alive.
    conn.rollback(beforeOptionalStep);
    System.out.println("optional step skipped: " + e.getMessage());
}

conn.commit(); // commits everything that survived

// Savepoint names must be unique inside the transaction.
// setSavepoint() with no argument returns an unnamed savepoint.
```

## Details

A savepoint is the tool for an all-or-nothing sub-step. One example is an audit row that may be rejected by a constraint, while the main booking must still commit. A full rollback would throw away the booking too.

Call `rollback(sp)` rather than `rollback()`. The no-argument form ends the whole transaction and releases every savepoint in it.

After a rollback to a savepoint, that savepoint may be considered used up by the driver, so keep `releaseSavepoint` on the success path only. MySQL supports savepoints on InnoDB and ignores them on MyISAM, which never rolls anything back.
