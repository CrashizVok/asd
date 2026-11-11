# setTransactionIsolation

Java command · Transactions

Sets the isolation level for the connection. It applies to the next transaction, so call it before setAutoCommit(false) or before the first statement commits.

## Syntax

```java
conn.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED)
```

## Example

```java
// Data shape: one of the five int constants on Connection.
// TRANSACTION_NONE, READ_UNCOMMITTED, READ_COMMITTED, REPEATABLE_READ, SERIALIZABLE.

try (Connection conn = DriverManager.getConnection(url, user, password)) {
    // Not every server supports every level. Check before setting.
    if (conn.getMetaData().supportsTransactionIsolationLevel(
            Connection.TRANSACTION_READ_COMMITTED)) {

        conn.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED);
    }

    // MySQL defaults to REPEATABLE_READ, PostgreSQL to READ_COMMITTED.
    System.out.println("isolation: " + conn.getTransactionIsolation());

    conn.setAutoCommit(false);
    try {
        // ... statements ...
        conn.commit();
    } catch (SQLException e) {
        conn.rollback();
        throw e;
    } finally {
        // A pooled connection must go back with the level it arrived with.
        conn.setAutoCommit(true);
    }
}
```

## Details

The level decides which concurrency problems are possible. `READ_UNCOMMITTED` allows dirty reads, `READ_COMMITTED` stops them, `REPEATABLE_READ` keeps a row stable inside the transaction, and `SERIALIZABLE` makes the result equivalent to running the transactions one after another. Higher levels mean more locking and more deadlocks.

Changing the level in the middle of a transaction is implementation defined. MySQL applies it to the next transaction, so the current one keeps its old level and the code looks correct while doing something else.

Pools keep the level they were configured with. If a method lowers it, put it back in `finally` the same way you restore `autoCommit`.
