# SQL injection

Java command · JDBC

Concatenated input can change the SQL grammar. A placeholder binds the value as data and never as code.

## Syntax

```java
SELECT ... WHERE city = ?   // never string concatenation
```

## Example

```java
// BROKEN: the input can close the quote and add its own condition.
String city = request.getParameter("city");
String bad = "SELECT hotel_id, name FROM hotels WHERE city = '" + city + "'";
// Input: Budapest' OR '1'='1
// Result: WHERE city = 'Budapest' OR '1'='1'

// FIXED: one placeholder, one value, no matter what the value contains.
String sql = "SELECT hotel_id, name FROM hotels WHERE city = ?";
try (Connection conn = DriverManager.getConnection(url, user, password);
     PreparedStatement ps = conn.prepareStatement(sql)) {

    ps.setString(1, city);
    try (ResultSet rs = ps.executeQuery()) {
        while (rs.next()) {
            System.out.println(rs.getInt("hotel_id") + " " + rs.getString("name"));
        }
    }
}

// Identifiers cannot be bound. Use a whitelist, never the raw request value.
String sortColumn = switch (request.getParameter("sort")) {
    case "stars" -> "stars";
    case "name" -> "name";
    default -> "hotel_id";
};
```

## Details

The driver escapes the value and the server parses the SQL before the value arrives, so quotes inside the value cannot become syntax. That is the whole defense.

A prepared query still needs an authorization condition. A user who can pass any customer_email can read another customer's rows if the WHERE clause does not also filter by the logged-in owner.
