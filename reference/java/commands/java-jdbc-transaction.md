# commit and rollback

Java command · JDBC

Groups statements into one unit of work. A failure rolls back every statement in the transaction.

## Syntax

```java
conn.setAutoCommit(false); ... conn.commit(); ... conn.rollback();
```

## Example

```java
try (Connection conn = DriverManager.getConnection(url, user, password)) {
    boolean originalAutoCommit = conn.getAutoCommit();
    conn.setAutoCommit(false);

    try {
        try (PreparedStatement debit = conn.prepareStatement(
                "UPDATE accounts SET balance = balance - ? WHERE id = ?");
             PreparedStatement credit = conn.prepareStatement(
                "UPDATE accounts SET balance = balance + ? WHERE id = ?")) {

            debit.setInt(1, 100);
            debit.setInt(2, 1);
            debit.executeUpdate();

            credit.setInt(1, 100);
            credit.setInt(2, 2);
            credit.executeUpdate();
        }

        conn.commit();
        System.out.println("transfer done");
    } catch (SQLException e) {
        conn.rollback();
        throw e;
    } finally {
        // Required when the connection is pooled and will be reused.
        conn.setAutoCommit(originalAutoCommit);
    }
}
```

## Details

MySQL commits DDL implicitly. A CREATE TABLE in the middle of a transaction ends it, so keep schema changes outside the unit of work.

A savepoint rolls back only part of the transaction. Call setSavepoint before the optional step, then rollback(savepoint) on failure and commit the rest.
