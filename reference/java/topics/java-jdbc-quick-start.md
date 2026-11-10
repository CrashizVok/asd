# JDBC quick start

Java topic · Exam Wiki

```java
String url = "jdbc:mysql://localhost:3306/bookings?useSSL=false&serverTimezone=UTC";
try (Connection conn = DriverManager.getConnection(url, "root", "password");
     PreparedStatement ps = conn.prepareStatement(
         "SELECT name, stars FROM hotels WHERE city = ? ORDER BY name")) {

    ps.setString(1, "Budapest");

    try (ResultSet rs = ps.executeQuery()) {
        while (rs.next()) {
            System.out.println(rs.getString("name") + " " + rs.getInt("stars"));
        }
    }
}
```

Always use `?` placeholders for user input. String concatenation opens SQL injection.
