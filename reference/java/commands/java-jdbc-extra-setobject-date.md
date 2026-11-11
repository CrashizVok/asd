# setObject with a type

Java command · Parameters

Binds a value with an explicit SQL type. Use it for LocalDate and BigDecimal, or when the driver would guess a type the column does not accept.

## Syntax

```java
ps.setObject(index, value, Types.DATE)
```

## Example

```java
// Data shape: LocalDate -> DATE column, with no java.sql.Date in between.
String sql = "INSERT INTO bookings "
        + "(customer_email, hotel_id, start_date, end_date, adults, children) "
        + "VALUES (?, ?, ?, ?, ?, ?)";

try (PreparedStatement ps = conn.prepareStatement(sql)) {
    ps.setString(1, "jane.doe@example.com");
    ps.setInt(2, 1);

    // JDBC 4.2 sends LocalDate directly when the driver understands it.
    ps.setObject(3, LocalDate.of(2024, 5, 1), Types.DATE);
    ps.setObject(4, LocalDate.of(2024, 5, 4), Types.DATE);

    ps.setInt(5, 2);
    ps.setInt(6, 0);
    ps.executeUpdate();
}

// The portable fallback that works with every driver:
// ps.setDate(3, java.sql.Date.valueOf(LocalDate.of(2024, 5, 1)));
```

## Details

`setObject(index, value)` lets the driver infer the SQL type from the Java class. That works for `String` and `Integer` and is risky for dates, because `LocalDate` can be sent as `DATE`, `TIMESTAMP`, or a string depending on the driver version. Passing `Types.DATE` explicitly removes the guess.

On the read side the mirror call is `rs.getObject("start_date", LocalDate.class)`. Both directions need JDBC 4.2 and a driver that implements it. Connector/J 8 does; an old 5.x jar does not.

When an exam answer has to work anywhere, use `java.sql.Date.valueOf(localDate)` and `rs.getDate(...).toLocalDate()`. It is two conversions longer and it never depends on driver behaviour.
