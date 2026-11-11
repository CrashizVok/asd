# ResultSet.wasNull()

Java command · Results

Reports whether the last column read was SQL NULL. Required whenever a primitive getter turns NULL into 0, false, or 0.0.

## Syntax

```java
int v = rs.getInt("col"); if (rs.wasNull()) { ... }
```

## Example

```java
// Data shape: int cannot hold NULL, so the getter substitutes 0.
String sql = "SELECT hotel_id, stars, description, adults FROM bookings WHERE booking_id = ?";

try (PreparedStatement ps = conn.prepareStatement(sql)) {
    ps.setInt(1, 7);

    try (ResultSet rs = ps.executeQuery()) {
        if (rs.next()) {
            int stars = rs.getInt("stars");

            // Check immediately. Any other getter resets the flag.
            boolean starsMissing = rs.wasNull();
            Integer nullableStars = starsMissing ? null : stars;

            // getString already returns null, no extra check needed.
            String description = rs.getString("description");

            System.out.println(nullableStars + " " + description);
        }
    }
}

// getBoolean returns false for NULL, getDouble returns 0.0, getDate returns null.
// Only the getDate case is unambiguous.
```

## Details

`wasNull` is a property of the last getter call on that result set, not of the column. Calling `getString` after `getInt` replaces the flag, so the check has to sit on the line after the read it belongs to.

The alternative is to skip the primitive getter entirely: `(Integer) rs.getObject("stars")` returns null for a NULL column and the boxed value otherwise. That is shorter, and it costs one cast.

A zero that really means zero is the dangerous case. A hotel with zero stars and a hotel with no rating produce the same int, and only `wasNull` tells them apart.
