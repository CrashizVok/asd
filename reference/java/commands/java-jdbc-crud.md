# Insert, update, delete

Java command · JDBC

Returns the number of affected rows. Use it to detect a missing row, because a matched-nothing update returns 0.

## Syntax

```java
ps.executeUpdate()
```

## Example

```java
String insert = "INSERT INTO hotels (city, name, description, stars, owner_email) "
        + "VALUES (?, ?, ?, ?, ?)";
String update = "UPDATE hotels SET stars = ? WHERE hotel_id = ?";
String delete = "DELETE FROM bookings WHERE booking_id = ?";

try (Connection conn = DriverManager.getConnection(url, user, password)) {

    try (PreparedStatement ps = conn.prepareStatement(insert)) {
        ps.setString(1, "Budapest");
        ps.setString(2, "Hotel Sunrise");
        ps.setString(3, "Quiet hotel near the river");
        ps.setInt(4, 4);
        ps.setString(5, "owner@example.com");
        System.out.println("inserted: " + ps.executeUpdate());
    }

    try (PreparedStatement ps = conn.prepareStatement(update)) {
        ps.setInt(1, 5);
        ps.setInt(2, 1);
        int changed = ps.executeUpdate();
        if (changed == 0) {
            System.out.println("no hotel with id 1");
        }
    }

    try (PreparedStatement ps = conn.prepareStatement(delete)) {
        ps.setInt(1, 7);
        System.out.println("deleted: " + ps.executeUpdate());
    }
}
```

## Details

executeUpdate is for INSERT, UPDATE, DELETE, and DDL. executeQuery is for SELECT. Calling the wrong one throws SQLException with a message about the result type.

A foreign key violation arrives as SQLIntegrityConstraintViolationException, a subclass of SQLException. Catch it only when the code can actually recover, such as reporting a duplicate email to the user.
